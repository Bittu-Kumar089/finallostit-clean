# 🪣 S3 Bucket Setup Guide

Your S3 bucket: **`lostit-storage`**

## Step 1: Configure S3 Bucket CORS

CORS (Cross-Origin Resource Sharing) allows your frontend to upload files directly to S3.

### 1.1 Go to S3 Bucket

1. **AWS Console** → **S3** → **Buckets**
2. Click on your bucket: **`lostit-storage`**

### 1.2 Configure CORS

1. Click **"Permissions"** tab
2. Scroll to **"Cross-origin resource sharing (CORS)"**
3. Click **"Edit"**
4. Paste this configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:3000"
    ],
    "ExposeHeaders": ["ETag", "x-amz-server-side-encryption", "x-amz-request-id", "x-amz-id-2"],
    "MaxAgeSeconds": 3000
  }
]
```

5. Click **"Save changes"**

---

## Step 2: Configure Bucket Policy (Public Read Access)

This allows uploaded images to be viewed by anyone (needed for lost/found items).

### 2.1 Set Bucket Policy

1. In your bucket → **"Permissions"** tab
2. Scroll to **"Bucket policy"**
3. Click **"Edit"**
4. Paste this policy (replace `lostit-storage` with your bucket name if different):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::lostit-storage/*"
    }
  ]
}
```

5. Click **"Save changes"**

---

## Step 3: Configure Block Public Access

For images to be publicly viewable, you need to allow public access.

### 3.1 Edit Block Public Access Settings

1. In your bucket → **"Permissions"** tab
2. Scroll to **"Block public access (bucket settings)"**
3. Click **"Edit"**
4. **Uncheck** "Block all public access"
5. Check the confirmation box
6. Click **"Save changes"**

**Note:** This is safe because:
- Only GET (read) is public
- PUT (upload) requires presigned URL from Lambda
- Your Lambda controls who can upload

---

## Step 4: Verify Lambda Function Has S3 Permissions

Your Lambda function needs permissions to generate presigned URLs.

### 4.1 Check Lambda Execution Role

1. **AWS Console** → **Lambda** → Your function
2. Go to **"Configuration"** tab → **"Permissions"**
3. Click on the **Execution role** name

### 4.2 Verify S3 Permissions

The role should have these permissions:

```json
{
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:GetObject",
    "s3:DeleteObject"
  ],
  "Resource": "arn:aws:s3:::lostit-storage/*"
}
```

If missing, add them:
1. Click **"Add permissions"** → **"Create inline policy"**
2. Use **JSON** editor
3. Paste the policy above
4. Name it: `S3AccessPolicy`
5. Click **"Create policy"**

---

## Step 5: Verify Lambda Function Code

Your Lambda function should handle the `/upload-url` endpoint.

### Expected Lambda Handler (Python Example)

```python
import boto3
import json
from datetime import datetime, timedelta
from urllib.parse import unquote

s3_client = boto3.client('s3')
BUCKET_NAME = 'lostit-storage'

def lambda_handler(event, context):
    # Handle CORS preflight
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            'body': ''
        }
    
    path = event.get('requestContext', {}).get('http', {}).get('path', '')
    method = event.get('requestContext', {}).get('http', {}).get('method', '')
    
    # Handle POST /upload-url
    if path == '/upload-url' and method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
            fileName = body.get('fileName')
            fileType = body.get('fileType', 'image/jpeg')
            
            # Generate presigned URL for upload (valid for 5 minutes)
            upload_url = s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': BUCKET_NAME,
                    'Key': fileName,
                    'ContentType': fileType
                },
                ExpiresIn=300  # 5 minutes
            )
            
            # Generate public URL for viewing
            view_url = f"https://{BUCKET_NAME}.s3.{s3_client.meta.region_name}.amazonaws.com/{fileName}"
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'uploadUrl': upload_url,
                    'viewUrl': view_url
                })
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': str(e)})
            }
    
    # Handle other endpoints...
    return {
        'statusCode': 404,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Not found'})
    }
```

---

## Step 6: Test S3 Upload

### 6.1 Test Upload Flow

1. **Start your dev server**: `npm run dev`
2. **Sign in** to your app
3. Click **"I Found Something"** or **"I Lost Something"**
4. **Upload an image**
5. **Fill in the form** and submit
6. Check browser console for upload messages

### 6.2 Verify Upload in S3

1. **AWS Console** → **S3** → **`lostit-storage`**
2. Click **"Objects"** tab
3. You should see a folder **`uploads/`**
4. Your uploaded images should be there!

### 6.3 Check Image URL

After upload, the image URL should look like:
```
https://lostit-storage.s3.us-east-1.amazonaws.com/uploads/1234567890-image.jpg
```

---

## Troubleshooting

### Issue: CORS Error

**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Fix:**
- Check S3 CORS configuration (Step 1)
- Make sure your origin (`http://localhost:5173`) is in AllowedOrigins
- Check Lambda CORS headers

### Issue: 403 Forbidden

**Error:** `403 Forbidden` when uploading

**Fix:**
- Check Lambda execution role has S3 permissions (Step 4)
- Verify bucket name matches in Lambda code
- Check presigned URL expiration (should be 5-15 minutes)

### Issue: Image Not Viewable

**Error:** Image URL returns 403 or doesn't load

**Fix:**
- Check bucket policy allows public read (Step 2)
- Verify Block Public Access is disabled (Step 3)
- Check image URL format is correct

### Issue: Upload URL Generation Fails

**Error:** Lambda returns error when requesting upload URL

**Fix:**
- Check Lambda logs in CloudWatch
- Verify bucket name in Lambda code matches actual bucket
- Check Lambda has `s3:PutObject` permission

---

## Quick Checklist

- [ ] S3 bucket `lostit-storage` exists
- [ ] CORS configured with your localhost origins
- [ ] Bucket policy allows public read
- [ ] Block public access is disabled
- [ ] Lambda execution role has S3 permissions
- [ ] Lambda function handles `/upload-url` endpoint
- [ ] Lambda generates presigned URLs correctly
- [ ] Test upload works
- [ ] Images appear in S3 bucket
- [ ] Images are viewable via public URL

---

## Next Steps

After S3 is configured:
1. ✅ Test image upload from your app
2. ✅ Verify images appear in S3 bucket
3. ✅ Check images load correctly in the app
4. ✅ Move on to DynamoDB integration

Your S3 integration is ready! 🎉

