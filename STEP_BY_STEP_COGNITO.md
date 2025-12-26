# 📸 Step-by-Step: Configure Cognito Callback URLs

## Current Location
You're on the **User Pool Overview** page for `us-east-1_YKElndFwS`

## Next Steps:

### Step 1: Click "App integration" Tab
- Look at the **top menu** (below the User Pool name)
- Click the tab that says **"App integration"**
- This is where you configure how your app connects to Cognito

### Step 2: Find App Clients Section
- Scroll down on the App integration page
- Look for a section called **"App clients"**
- You should see your app client: `8spmlgkq5uri5tc3v39jr1vlb`

### Step 3: Edit the App Client
- Click on the app client name/ID: `8spmlgkq5uri5tc3v39jr1vlb`
- OR click the **"Edit"** button next to it

### Step 4: Scroll to Hosted UI Section
- In the Edit screen, scroll down
- Find the section called **"Hosted UI"**
- Expand it if it's collapsed

### Step 5: Add Callback URLs

**In the "Allowed callback URLs" field:**
- Click in the text box
- Type or paste these URLs (one per line):
  ```
  http://localhost:5173
  http://localhost:5174
  http://localhost:5175
  ```

**In the "Allowed sign-out URLs" field:**
- Add the same URLs:
  ```
  http://localhost:5173
  http://localhost:5174
  http://localhost:5175
  ```

### Step 6: Verify OAuth Settings

While you're here, check these settings are enabled:

**OAuth 2.0 grant types:**
- ✅ Check **"Authorization code grant"**

**OpenID Connect scopes:**
- ✅ Check **"openid"**
- ✅ Check **"email"**
- ✅ Check **"profile"**

**Allowed OAuth flows:**
- ✅ Check **"Authorization code grant"**

**Allowed OAuth scopes:**
- ✅ Check **"openid"**
- ✅ Check **"email"**
- ✅ Check **"profile"**

### Step 7: Save Changes
- Scroll to the bottom of the page
- Click **"Save changes"** button
- Wait for confirmation message

### Step 8: Wait and Test
- ⏱️ **Wait 1-2 minutes** for changes to propagate
- Restart your dev server: `npm run dev`
- Try signing in again!

---

## Visual Path:

```
User Pool Overview
    ↓
Click "App integration" tab
    ↓
Scroll to "App clients" section
    ↓
Click app client: 8spmlgkq5uri5tc3v39jr1vlb
    ↓
Click "Edit" button
    ↓
Scroll to "Hosted UI" section
    ↓
Add callback URLs:
  http://localhost:5173
  http://localhost:5174
  http://localhost:5175
    ↓
Add same to sign-out URLs
    ↓
Click "Save changes"
    ↓
✅ Done!
```

---

## Important Notes:

1. **Port Number**: Make sure you add the port your dev server is actually using!
   - Check your terminal - it shows: `Local: http://localhost:XXXX`
   - Add that exact port number

2. **No Trailing Slash**: Use `http://localhost:5173` NOT `http://localhost:5173/`

3. **Wait Time**: Changes can take 1-2 minutes to apply

4. **Restart Server**: After making changes, restart your dev server

---

## Can't Find "App integration" Tab?

If you don't see the "App integration" tab:
1. Make sure you're on the User Pool page (not User Pool list)
2. Look for tabs: "Sign-in experience", "Security", "App integration", etc.
3. "App integration" should be one of the main tabs

---

## Still Stuck?

Take a screenshot of:
1. The "App integration" page
2. The "App clients" section
3. The "Edit app client" screen

And share it - I'll help you find the exact field!

