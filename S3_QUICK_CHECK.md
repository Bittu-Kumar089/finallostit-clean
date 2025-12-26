# ⚡ S3 Quick Setup Checklist

## Your S3 Bucket: `lostit-storage`

### ✅ Step 1: Configure CORS (5 minutes)

1. **AWS Console** → **S3** → **`lostit-storage`**
2. **Permissions** tab → **CORS** → **Edit**
3. Paste this:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:5173", "http://localhost:5174"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

4. **Save changes**

---

### ✅ Step 2: Allow Public Read (2 minutes)

1. **Permissions** tab → **Block public access** → **Edit**
2. **Uncheck** "Block all public access"
3. **Save changes**

4. **Permissions** tab → **Bucket policy** → **Edit**
5. Paste this:

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

6. **Save changes**

---

### ✅ Step 3: Verify Lambda Permissions (2 minutes)

1. **Lambda** → Your function → **Configuration** → **Permissions**
2. Click **Execution role**
3. Verify it has S3 permissions:
   - `s3:PutObject`
   - `s3:GetObject`
   - `s3:DeleteObject`

If missing, add them!

---

### ✅ Step 4: Test Upload

1. Restart dev server: `npm run dev`
2. Sign in to your app
3. Click **"I Found Something"**
4. Upload an image
5. Submit the form
6. Check S3 bucket → `uploads/` folder
7. Image should be there! ✅

---

## Common Issues

**CORS Error?**
→ Check Step 1, make sure your port is in AllowedOrigins

**403 Forbidden?**
→ Check Step 2, disable Block Public Access

**Upload fails?**
→ Check Step 3, Lambda needs S3 permissions

**Image not viewable?**
→ Check bucket policy (Step 2)

---

## Done! 🎉

Your S3 integration should work now. Try uploading an image!

