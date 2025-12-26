# ⚡ Quick Start Checklist

## Immediate Next Steps:

### 1. Create `.env` file
Create a `.env` file in the root directory with these variables:

```env
VITE_GEMINI_API_KEY=your_key_here
VITE_COGNITO_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_API_BASE_URL=https://your-lambda-url.lambda-url.us-east-1.on.aws
VITE_S3_BUCKET=lostit-images-production
VITE_S3_REGION=us-east-1
```

### 2. AWS Setup (Do these in order)

#### A. Cognito User Pool
- AWS Console → Cognito → Create User Pool
- Enable Email sign-in
- Create App Client with callback: `http://localhost:5173`
- Create Cognito domain
- Copy User Pool ID, Client ID, and Domain to `.env`

#### B. S3 Bucket
- AWS Console → S3 → Create Bucket
- Name: `lostit-images-production` (or unique name)
- Uncheck "Block all public access"
- Add CORS policy (see SETUP_GUIDE.md)
- Copy bucket name to `.env`

#### C. DynamoDB Table
- AWS Console → DynamoDB → Create Table
- Name: `lostit-items`
- Partition key: `id` (String)
- Copy table name (your Lambda needs this)

#### D. Lambda Function
- Deploy Lambda with DynamoDB + S3 permissions
- Enable Function URL with CORS
- Copy Function URL to `.env` as `VITE_API_BASE_URL`

### 3. Test
```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and test:
- ✅ Sign in button redirects to Cognito
- ✅ Can create account/sign in
- ✅ Can upload items with images
- ✅ Items appear in DynamoDB

---

**Full detailed guide**: See `SETUP_GUIDE.md`


