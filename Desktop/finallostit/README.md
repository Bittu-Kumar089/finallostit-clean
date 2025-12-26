# LOSTit - Smart Serverless Lost & Found System 🔍

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![AWS](https://img.shields.io/badge/Backend-AWS%20Serverless-orange)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-purple)
![Status](https://img.shields.io/badge/Status-Live-green)

**LOSTit** is an intelligent, cloud-native Lost & Found management platform designed for universities and public spaces. It leverages **AWS Serverless architecture** for scalability and **Generative AI** for automated item recognition and user support, solving the chaos of manual lost and found logs.

> **Project Lead**: Priyanshu Kumar Gurjar  
> **Contact**: pk2525507@gmail.com | +91 7717255246

---

## 🌟 Key Features

### 🧠 AI-Powered Reporting
- **Auto-Tagging**: Upload an image, and Google Gemini AI automatically detects the item's category, color, and description.
- **Visual Search**: Users can search for items based on visual characteristics.

### 💬 Intelligent Chat Assistant
- **Gemini 3 Pro Integration**: A context-aware chatbot that helps users navigate the reporting process, explains safety features, and answers FAQs about retrieving items.

### ☁️ Serverless Architecture (AWS)
- **AWS Lambda**: Python-based backend logic that scales to zero when not in use.
- **Amazon DynamoDB**: NoSQL database for fast retrieval of lost/found items.
- **Amazon S3**: Secure cloud storage for item images via Presigned URLs.
- **AWS Cognito**: Secure user authentication and session management.

### 🔒 Secure Verification
- **QR Code Identity**: Every item gets a unique QR code. Scanners can verify ownership instantly.
- **Privacy First**: Contact details are masked until a claim is verified.

---

## ⚙️ Technical Architecture

The application follows a modern Event-Driven Serverless architecture:

1.  **Frontend (React/Vite)**: Connects to AWS via REST/HTTP calls.
2.  **API Layer**: AWS Lambda Function URLs.
3.  **Storage**: 
    - Images -> Direct upload to **S3** (Client-side signed URL).
    - Metadata -> Stored in **DynamoDB**.
4.  **AI Engine**: Frontend communicates directly with **Google Gemini API**.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- AWS Account (Sandbox or Personal)
- Google Gemini API Key

### 1. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/LOSTit-Project.git
cd LOSTit-Project
npm install
```

### 2. Configuration
Create a `.env` file in the root with your AWS + Gemini values:
```env
# Google Gemini
VITE_GEMINI_API_KEY=your_google_gemini_key

# AWS Cognito (Hosted UI)
VITE_COGNITO_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# API Gateway / Lambda function URL
VITE_API_BASE_URL=https://your-lambda-or-apigw-url.on.aws

# S3 bucket for images
VITE_S3_BUCKET=lostit-images-production
VITE_S3_REGION=us-east-1
```

### 3. Run the Web App
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🛡 License

This project is licensed for educational use.