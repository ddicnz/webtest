import json
import os
import base64
from datetime import datetime, timezone
from decimal import Decimal

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


def is_admin(claims):
    groups = claims.get("cognito:groups") or claims.get("groups") or ""
    if isinstance(groups, list):
        return "admin" in groups
    return "admin" in [group.strip() for group in str(groups).split(",")]


def profile_owner(profile):
    return clean_str(
        profile.get("cognitoSub")
        or profile.get("userSub")
        or profile.get("ownerSub")
        or profile.get("sub")
    )


def find_material_index(records, material_id, s3_key):
    for index, record in enumerate(records):
        if material_id and clean_str(record.get("materialId")) == material_id:
            return index
        if s3_key and clean_str(record.get("s3Key")) == s3_key:
            return index
    return -1


def lambda_handler(event, context):
    method = get_method(event).upper()
    if method == "OPTIONS":
        return make_response(200, {"ok": True})
    if method != "POST":
        return make_response(405, {"ok": False, "message": "Method not allowed"})

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

        if not profile_id or not visa_type or not category_id:
            return make_response(400, {"ok": False, "message": "profileId, visaType and categoryId are required"})
        if not material_id and not requested_s3_key:
            return make_response(400, {"ok": False, "message": "materialId or s3Key is required"})

        profile = table.get_item(Key={"profileId": profile_id}, ConsistentRead=True).get("Item")
        if not profile:
            return make_response(404, {"ok": False, "message": "Visa profile not found"})
        if profile_owner(profile) != user_sub and not is_admin(claims):
            return make_response(403, {"ok": False, "message": "You cannot modify this visa profile"})

        field_key = f"{visa_type}#{category_id}"
        records = list((profile.get("materials") or {}).get(field_key) or [])
        index = find_material_index(records, material_id, requested_s3_key)
        if index < 0:
            return make_response(404, {"ok": False, "message": "Material record not found"})

        removed_record = records[index]
        s3_key = clean_str(removed_record.get("s3Key"))
        remaining_records = records[:index] + records[index + 1 :]
        now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

        table.update_item(
            Key={"profileId": profile_id},
            UpdateExpression="SET materials.#field_key = :records, updatedAt = :updated_at",
            ConditionExpression="materials.#field_key = :old_records",
            ExpressionAttributeNames={"#field_key": field_key},
            ExpressionAttributeValues={
                ":records": remaining_records,
                ":old_records": records,
                ":updated_at": now,
            },
        )

        try:
            if s3_key:
                s3.delete_object(Bucket=BUCKET_NAME, Key=s3_key)
        except Exception:
            table.update_item(
                Key={"profileId": profile_id},
                UpdateExpression="SET materials.#field_key = :records, updatedAt = :updated_at",
                ConditionExpression="materials.#field_key = :deleted_records",
                ExpressionAttributeNames={"#field_key": field_key},
                ExpressionAttributeValues={
                    ":records": records,
                    ":deleted_records": remaining_records,
                    ":updated_at": now,
                },
            )
            raise

        return make_response(200, {
            "ok": True,
            "message": "Material deleted successfully",
            "materialId": removed_record.get("materialId"),
            "s3Key": s3_key,
        })

    except json.JSONDecodeError:
        return make_response(400, {"ok": False, "message": "Request body must be valid JSON"})
    except ClientError as error:
        error_code = error.response.get("Error", {}).get("Code", "")
        if error_code == "ConditionalCheckFailedException":
            return make_response(409, {
                "ok": False,
                "message": "Material list changed. Please refresh and try again",
            })
        print(f"deleteVisaMaterial AWS failure: {error_code or type(error).__name__}")
        return make_response(500, {"ok": False, "message": "Failed to delete material"})
    except Exception as error:
        print(f"deleteVisaMaterial failed: {type(error).__name__}")
        return make_response(500, {"ok": False, "message": "Failed to delete material"})
