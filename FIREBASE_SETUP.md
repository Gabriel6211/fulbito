# Firebase Configuration Setup Guide

## Problem
You're getting `auth/invalid-api-key` error because the client-side Firebase configuration is missing.

## Solution: Get Your Firebase Web App Config

The client-side Firebase SDK needs different values than the server-side Admin SDK. Follow these steps:

### Step 1: Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **fulbito-e977d**

### Step 2: Get Web App Configuration
1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Select **Project Settings**
3. Scroll down to **Your apps** section
4. If you don't have a web app yet:
   - Click **"Add app"** button
   - Select the **Web icon** (`</>`)
   - Register your app (you can name it "tubilletera-web")
   - Click **Register app**
5. Copy the config values from the `firebaseConfig` object

### Step 3: Add to .env.local
Add these values to your `.env.local` file (replace with your actual values):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fulbito-e977d.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fulbito-e977d
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fulbito-e977d.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX  # Optional, only if Analytics is enabled
```

### Step 4: Restart Your Dev Server
After updating `.env.local`, restart your Next.js dev server:
```bash
npm run dev
```

## Important Notes

- **NEXT_PUBLIC_** prefix is required for client-side environment variables in Next.js
- These values are safe to expose in the browser (they're public)
- The API key is restricted by domain in Firebase Console, so it's secure
- Never commit `.env.local` to git (it's already in `.gitignore`)

## Quick Reference

The Firebase config object looks like this in the console:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "fulbito-e977d.firebaseapp.com",
  projectId: "fulbito-e977d",
  storageBucket: "fulbito-e977d.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

Map these to your `.env.local`:
- `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
- `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`
- `measurementId` → `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)
