import json
import os
import re
from datetime import datetime, timezone
from decimal import Decimal

import boto3


TABLE_NAME = os.environ.get("TABLE_NAME", "DDVisaProfiles")

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


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


def preserve_extension(old_name, new_name):
    old_base, old_extension = os.path.splitext(old_name)
    new_base, new_extension = os.path.splitext(new_name)
    if not old_extension:
        return new_name
    if new_extension.lower() == old_extension.lower():
        return new_name
    return f"{new_base or new_name}{old_extension}"


def find_material_index(records, material_id, s3_key):
    for index, record in enumerate(records):
        if material_id and clean_str(record.get("materialId")) == material_id:
            return index
        if s3_key and clean_str(record.get("s3Key")) == s3_key:
            return index
    return -1


def lambda_handler(event, context):
    if get_method(event) == "OPTIONS":
        return make_response(200, {"ok": True})

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
        s3_key = clean_str(body.get("s3Key"))
        requested_name = safe_filename(body.get("newName"))

        if not profile_id or not visa_type or not category_id:
            return make_response(400, {"ok": False, "message": "profileId, visaType and categoryId are required"})
        if not material_id and not s3_key:
            return make_response(400, {"ok": False, "message": "materialId or s3Key is required"})
        if not requested_name:
            return make_response(400, {"ok": False, "message": "newName is required"})

        profile = table.get_item(Key={"profileId": profile_id}, ConsistentRead=True).get("Item")
        if not profile:
            return make_response(404, {"ok": False, "message": "Visa profile not found"})
        if profile_owner(profile) != user_sub:
            return make_response(403, {"ok": False, "message": "You cannot modify this visa profile"})

        field_key = f"{visa_type}#{category_id}"
        records = list((profile.get("materials") or {}).get(field_key) or [])
        index = find_material_index(records, material_id, s3_key)
        if index < 0:
            return make_response(404, {"ok": False, "message": "Material record not found"})

        old_name = clean_str(records[index].get("originalName") or records[index].get("name"))
        new_name = preserve_extension(old_name, requested_name)
        records[index] = {
            **records[index],
            "originalName": new_name,
            "displayName": new_name,
            "renamedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        }
        now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

        table.update_item(
            Key={"profileId": profile_id},
            UpdateExpression="SET materials.#field_key = :records, updatedAt = :updated_at",
            ExpressionAttributeNames={"#field_key": field_key},
            ExpressionAttributeValues={":records": records, ":updated_at": now},
        )

        return make_response(200, {
            "ok": True,
            "message": "Material renamed successfully",
            "materialId": records[index].get("materialId"),
            "originalName": new_name,
        })

    except json.JSONDecodeError:
        return make_response(400, {"ok": False, "message": "Request body must be valid JSON"})
    except Exception as error:
        print(f"renameVisaMaterial failed: {type(error).__name__}")
        return make_response(500, {"ok": False, "message": "Failed to rename material", "error": str(error)})
