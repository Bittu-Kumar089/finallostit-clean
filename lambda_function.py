import boto3
import json
from datetime import datetime, timedelta
from urllib.parse import unquote

s3_client = boto3.client('s3')
# UPDATE THIS WITH YOUR ACTUAL BUCKET NAME
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
            
            if not fileName:
                 return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'fileName is required'})
                }

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
            view_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{fileName}"
            
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
            print(f"Error: {str(e)}")
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
