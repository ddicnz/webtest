import base64
import json
import os
import re
from datetime import datetime, timezone
from decimal import Decimal
from urllib.parse import quote

import boto3
from botocore.exceptions import ClientError


TABLE_NAME = os.environ.get("TABLE_NAME", "DDVisaProfiles")
BUCKET_NAME = os.environ.get("BUCKET_NAME", "ddvisapdf")

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)
s3 = boto3.client("s3")


def decimal_default(value):
    if isinstance(value, Decimal):
        return int(value) if value % 1 == 0 else float(value)
    raise TypeError(f"Object of type {type(value).__name__} is not JSON serializable")


def make_response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "content-type,authorization",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
        },
        "body": json.dumps(body, ensure_ascii=False, default=decimal_default),
    }


def get_method(event):
    method = event.get("httpMethod", "")
    return method or event.get("requestContext", {}).get("http", {}).get("method", "")


def get_claims(event):
    authorizer = event.get("requestContext", {}).get("authorizer", {})
    return authorizer.get("jwt", {}).get("claims", {}) or authorizer.get("claims", {})


def parse_body(event):
    raw_body = event.get("body") or "{}"
    if event.get("isBase64Encoded") and isinstance(raw_body, str):
        raw_body = base64.b64decode(raw_body).decode("utf-8")
    return json.loads(raw_body) if isinstance(raw_body, str) else raw_body


def clean_str(value):
    return str(value or "").strip()


def profile_owner(profile):
    return clean_str(
        profile.get("cognitoSub")
        or profile.get("userSub")
        or profile.get("ownerSub")
        or profile.get("sub")
    )


def safe_filename(value):
    name = re.sub(r"[\\/\x00-\x1f\x7f]", "", clean_str(value))
    name = re.sub(r"\s+", " ", name).strip(" .")
    return name[:180]


def preserve_extension(old_name, requested_name):
    old_extension = os.path.splitext(old_name)[1]
    requested_base, requested_extension = os.path.splitext(requested_name)

    if not old_extension:
        return requested_name
    if requested_extension.lower() == old_extension.lower():
        return requested_name
    if requested_extension:
        return f"{requested_base}{old_extension}"
    return f"{requested_name}{old_extension}"


def find_material_index(records, material_id, s3_key):
    for index, record in enumerate(records):
        if material_id and clean_str(record.get("materialId")) == material_id:
            return index
        if s3_key and clean_str(record.get("s3Key")) == s3_key:
            return index
    return -1


def build_renamed_s3_key(old_s3_key, new_name):
    prefix, separator, _ = old_s3_key.rpartition("/")
    return f"{prefix}/{new_name}" if separator else new_name


def s3_object_exists(s3_key):
    try:
        s3.head_object(Bucket=BUCKET_NAME, Key=s3_key)
        return True
    except ClientError as error:
        status_code = error.response.get("ResponseMetadata", {}).get("HTTPStatusCode")
        error_code = error.response.get("Error", {}).get("Code", "")
        if status_code == 404 or error_code in {"404", "NoSuchKey", "NotFound"}:
            return False
        raise


def copy_s3_object(old_s3_key, new_s3_key, new_name):
    source = s3.head_object(Bucket=BUCKET_NAME, Key=old_s3_key)
    copy_args = {
        "Bucket": BUCKET_NAME,
        "CopySource": {"Bucket": BUCKET_NAME, "Key": old_s3_key},
        "Key": new_s3_key,
        "MetadataDirective": "REPLACE",
        "Metadata": source.get("Metadata", {}),
        "ContentDisposition": f"attachment; filename*=UTF-8''{quote(new_name)}",
    }

    for source_key, target_key in (
        ("ContentType", "ContentType"),
        ("CacheControl", "CacheControl"),
        ("ContentEncoding", "ContentEncoding"),
        ("ContentLanguage", "ContentLanguage"),
        ("Expires", "Expires"),
    ):
        if source.get(source_key) is not None:
            copy_args[target_key] = source[source_key]

    s3.copy_object(**copy_args)


def lambda_handler(event, context):
    method = get_method(event).upper()
    if method == "OPTIONS":
        return make_response(200, {"ok": True})
    if method != "POST":
        return make_response(405, {"ok": False, "message": "Method not allowed"})

    new_s3_key = ""
    old_s3_key = ""
    copied_new_object = False

    try:
        claims = get_claims(event)
        user_sub = clean_str(claims.get("sub"))
        if not user_sub:
            return make_response(401, {"ok": False, "message": "Valid Cognito authentication is required"})

        body = parse_body(event)
        profile_id = clean_str(body.get("profileId"))
        visa_type = clean_str(body.get("visaType"))
        category_id = clean_str(body.get("categoryId"))
        material_id = clean_str(body.get("materialId"))
        requested_s3_key = clean_str(body.get("s3Key"))
        requested_name = safe_filename(body.get("newName"))

        if not profile_id or not visa_type or not category_id:
            return make_response(400, {"ok": False, "message": "profileId, visaType and categoryId are required"})
        if not material_id and not requested_s3_key:
            return make_response(400, {"ok": False, "message": "materialId or s3Key is required"})
        if not requested_name:
            return make_response(400, {"ok": False, "message": "newName is required"})

        profile = table.get_item(Key={"profileId": profile_id}, ConsistentRead=True).get("Item")
        if not profile:
            return make_response(404, {"ok": False, "message": "Visa profile not found"})
        if profile_owner(profile) != user_sub:
            return make_response(403, {"ok": False, "message": "You cannot modify this visa profile"})

        field_key = f"{visa_type}#{category_id}"
        old_records = list((profile.get("materials") or {}).get(field_key) or [])
        index = find_material_index(old_records, material_id, requested_s3_key)
        if index < 0:
            return make_response(404, {"ok": False, "message": "Material record not found"})

        old_record = old_records[index]
        old_s3_key = clean_str(old_record.get("s3Key"))
        if not old_s3_key:
            return make_response(409, {"ok": False, "message": "Material has no S3 key"})

        old_name = clean_str(
            old_record.get("originalName")
            or old_record.get("displayName")
            or old_s3_key.rsplit("/", 1)[-1]
        )
        new_name = preserve_extension(old_name, requested_name)
        new_s3_key = build_renamed_s3_key(old_s3_key, new_name)

        if new_s3_key == old_s3_key:
            return make_response(200, {
                "ok": True,
                "message": "Material name is unchanged",
                "materialId": old_record.get("materialId"),
                "originalName": new_name,
                "s3Key": old_s3_key,
            })

        if s3_object_exists(new_s3_key):
            return make_response(409, {"ok": False, "message": "A file with this name already exists"})

        copy_s3_object(old_s3_key, new_s3_key, new_name)
        copied_new_object = True

        now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        new_records = list(old_records)
        new_records[index] = {
            **old_record,
            "originalName": new_name,
            "displayName": new_name,
            "s3Key": new_s3_key,
            "renamedAt": now,
        }

        table.update_item(
            Key={"profileId": profile_id},
            UpdateExpression="SET materials.#field_key = :records, updatedAt = :updated_at",
            ConditionExpression="materials.#field_key = :old_records",
            ExpressionAttributeNames={"#field_key": field_key},
            ExpressionAttributeValues={
                ":records": new_records,
                ":old_records": old_records,
                ":updated_at": now,
            },
        )

        try:
            s3.delete_object(Bucket=BUCKET_NAME, Key=old_s3_key)
        except Exception:
            table.update_item(
                Key={"profileId": profile_id},
                UpdateExpression="SET materials.#field_key = :records, updatedAt = :updated_at",
                ConditionExpression="materials.#field_key = :renamed_records",
                ExpressionAttributeNames={"#field_key": field_key},
                ExpressionAttributeValues={
                    ":records": old_records,
                    ":renamed_records": new_records,
                    ":updated_at": now,
                },
            )
            s3.delete_object(Bucket=BUCKET_NAME, Key=new_s3_key)
            copied_new_object = False
            raise

        copied_new_object = False
        return make_response(200, {
            "ok": True,
            "message": "Material renamed successfully",
            "materialId": old_record.get("materialId"),
            "originalName": new_name,
            "oldS3Key": old_s3_key,
            "s3Key": new_s3_key,
        })

    except json.JSONDecodeError:
        return make_response(400, {"ok": False, "message": "Request body must be valid JSON"})
    except ClientError as error:
        if copied_new_object and new_s3_key:
            try:
                s3.delete_object(Bucket=BUCKET_NAME, Key=new_s3_key)
            except Exception:
                pass

        error_code = error.response.get("Error", {}).get("Code", "")
        if error_code == "ConditionalCheckFailedException":
            return make_response(409, {
                "ok": False,
                "message": "Material list changed. Please refresh and try again",
            })
        if error_code in {"NoSuchKey", "404", "NotFound"}:
            return make_response(404, {"ok": False, "message": "S3 source file was not found"})
        print(f"renameVisaMaterial AWS failure: {error_code or type(error).__name__}")
        return make_response(500, {"ok": False, "message": "Failed to rename material"})
    except Exception as error:
        if copied_new_object and new_s3_key:
            try:
                s3.delete_object(Bucket=BUCKET_NAME, Key=new_s3_key)
            except Exception:
                pass
        print(f"renameVisaMaterial failed: {type(error).__name__}")
        return make_response(500, {"ok": False, "message": "Failed to rename material"})
