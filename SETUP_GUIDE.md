# 🚀 AWS Integration Setup Guide

This guide will walk you through setting up AWS Cognito, S3, and DynamoDB for your LOSTit application.

## 📋 Prerequisites

- AWS Account (Free tier works fine)
- AWS CLI installed and configured (optional, but helpful)
- Node.js v18+ installed
- Google Gemini API Key

---

## Step 1: Install Dependencies

All required packages are already in `package.json`. Just run:

```bash
npm install
```

---

## Step 2: Set Up AWS Cognito (User Authentication)

### 2.1 Create Cognito User Pool

1. Go to **AWS Console** → **Amazon Cognito** → **User Pools** → **Create User Pool**
2. Choose **"Email"** as sign-in option
3. **Password policy**: Choose your preference (default is fine)
4. **MFA**: Optional (can skip for development)
5. **User pool name**: `lostit-user-pool` (or your choice)
6. Click **"Create user pool"**

### 2.2 Create App Client

1. In your User Pool, go to **"App integration"** tab
2. Scroll to **"App clients"** → Click **"Create app client"**
3. **App client name**: `lostit-web-client`
4. **Auth flows**: Enable **"Authorization code grant"** and **"openid"**
5. **Allowed callback URLs**: 
   - `http://localhost:5173` (for development)
   - `https://your-production-domain.com` (for production)
6. **Allowed sign-out URLs**: Same as above
7. Click **"Create app client"**

### 2.3 Set Up Hosted UI Domain

1. In **"App integration"** tab, scroll to **"Domain"**
2. Click **"Create Cognito domain"**
3. Choose a domain prefix (e.g., `lostit-auth`)
4. Click **"Create Cognito domain"**
5. **Note down your domain**: `lostit-auth.auth.us-east-1.amazoncognito.com`

### 2.4 Get Your Cognito Values

From your User Pool, copy:
- **User Pool ID**: `us-east-1_XXXXXXXXX` (found in User Pool overview)
- **App Client ID**: Found in App clients section
- **Domain**: The domain you just created

---

## Step 3: Set Up Amazon S3 (Image Storage)

### 3.1 Create S3 Bucket

1. Go to **AWS Console** → **S3** → **Create bucket**
2. **Bucket name**: `lostit-images-production` (must be globally unique)
3. **Region**: Choose same as Cognito (e.g., `us-east-1`)
4. **Block Public Access**: **Uncheck** "Block all public access" (we need public read for images)
5. **Bucket Versioning**: Disabled (unless you need it)
6. Click **"Create bucket"**

### 3.2 Configure Bucket CORS

1. Open your bucket → **Permissions** tab → **Cross-origin resource sharing (CORS)**
2. Click **"Edit"** and paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:5173", "https://your-production-domain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

3. Click **"Save changes"**

### 3.3 Set Bucket Policy (Optional - for public read)

1. Go to **Permissions** → **Bucket policy**
2. Click **"Edit"** and add:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::lostit-images-production/*"
    }
  ]
}
```

Replace `lostit-images-production` with your bucket name.

---

## Step 4: Set Up DynamoDB (Database)

### 4.1 Create DynamoDB Table

1. Go to **AWS Console** → **DynamoDB** → **Tables** → **Create table**
2. **Table name**: `lostit-items`
3. **Partition key**: `id` (type: String)
4. **Table settings**: Use default settings (On-demand capacity)
5. Click **"Create table"**

### 4.2 Note Table Details

- **Table name**: `lostit-items`
- **Region**: Same as your other resources

**Note**: Your Lambda function needs to have permissions to read/write to this table. Make sure your Lambda execution role includes DynamoDB permissions.

---

## Step 5: Configure Your Backend (Lambda Function)

Your Lambda function needs to:

1. **Generate S3 presigned URLs** for uploads
2. **Read/Write to DynamoDB** table `lostit-items`
3. **Accept Cognito tokens** for authentication

### Lambda Function Requirements:

```python
# Example Lambda handler structure
import boto3
import json
from datetime import datetime, timedelta

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('lostit-items')
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    # Verify Cognito token (if needed)
    # Handle GET /items - scan DynamoDB
    # Handle POST /items - put item in DynamoDB
    # Handle POST /upload-url - generate S3 presigned URL
    # Handle DELETE /items/{id} - delete from DynamoDB
    pass
```

### Lambda Permissions Needed:

Your Lambda execution role needs:
- `dynamodb:PutItem`
- `dynamodb:GetItem`
- `dynamodb:Scan`
- `dynamodb:DeleteItem`
- `s3:PutObject`
- `s3:GetObject`
- `s3:GeneratePresignedUrl`

---

## Step 6: Create Environment Variables File

1. Create a `.env` file in the root directory:

```bash
# Copy this template and fill in your values
cp .env.example .env
```

2. Edit `.env` with your actual values:

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# AWS Cognito Configuration
VITE_COGNITO_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_DOMAIN=lostit-auth.auth.us-east-1.amazoncognito.com
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# API Gateway / Lambda Function URL
VITE_API_BASE_URL=https://your-lambda-url.lambda-url.us-east-1.on.aws

# S3 Bucket Configuration
VITE_S3_BUCKET=lostit-images-production
VITE_S3_REGION=us-east-1
```

---

## Step 7: Test Your Setup

### 7.1 Start Development Server

```bash
npm run dev
```

### 7.2 Test Authentication

1. Open `http://localhost:5173`
2. Click **"Sign In"**
3. You should be redirected to Cognito Hosted UI
4. Create a test user or sign in
5. You should be redirected back to your app

### 7.3 Test Item Creation

1. Sign in
2. Click **"I Found Something"** or **"I Lost Something"**
3. Fill out the form and upload an image
4. Submit - it should save to DynamoDB and upload image to S3

### 7.4 Verify in AWS Console

- **DynamoDB**: Check `lostit-items` table for new items
- **S3**: Check your bucket for uploaded images
- **CloudWatch**: Check Lambda logs for any errors

---

## 🔧 Troubleshooting

### Authentication Issues

- **Redirect URI mismatch**: Make sure callback URLs in Cognito match exactly (including `http://` vs `https://`)
- **CORS errors**: Check that your Cognito domain allows your origin
- **Token errors**: Verify your User Pool ID and Client ID are correct

### S3 Upload Issues

- **403 Forbidden**: Check bucket CORS configuration and bucket policy
- **Presigned URL expired**: Check Lambda function generates URLs with sufficient expiration time
- **CORS errors**: Ensure S3 CORS includes your frontend origin

### DynamoDB Issues

- **Access Denied**: Check Lambda execution role has DynamoDB permissions
- **Table not found**: Verify table name matches in Lambda code
- **Region mismatch**: Ensure all resources are in the same region

### API Issues

- **CORS errors**: Ensure Lambda Function URL has CORS enabled
- **401 Unauthorized**: Check token is being sent correctly in headers
- **500 errors**: Check CloudWatch logs for Lambda errors

---

## 📚 Additional Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)

---

## ✅ Checklist

- [ ] Cognito User Pool created
- [ ] Cognito App Client created with correct callback URLs
- [ ] Cognito Hosted UI domain configured
- [ ] S3 bucket created with CORS enabled
- [ ] DynamoDB table created
- [ ] Lambda function deployed with correct permissions
- [ ] `.env` file created with all values
- [ ] Application tested locally
- [ ] Authentication flow works
- [ ] Image upload works
- [ ] Items save to DynamoDB

---

**Need Help?** Check the AWS Console for error messages and CloudWatch logs for detailed debugging information.


