# Vercel Environment Variables Guide

This guide provides a complete reference for all the environment variables required to deploy your "Glow & Flourish" application on Vercel.

There are two types of variables:
1.  **Public Variables**: Prefixed with `NEXT_PUBLIC_`. These are safe to be exposed to the client-side (the user's browser).
2.  **Private Variables**: These are secrets for your server and must **never** be exposed to the client.

---

## Part 1: Public Client-Side Variables

These variables are used to initialize the Firebase and PayPal SDKs in the user's browser.

### How to Find Your Firebase Client-Side Keys

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project (`glow-flourish-online`).
3.  Click the gear icon ⚙️ next to "Project Overview" and go to **Project settings**.
4.  In the **General** tab, scroll down to the **Your apps** section.
5.  Select your web app. You will see an object called `firebaseConfig`. Use these values for the keys below.

### Vercel Variable Configuration (Public)

Go to your Vercel project > Settings > Environment Variables. Add the following keys:

| Vercel Variable Name                        | Value Source (from `firebaseConfig`)           |
| ------------------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`              | `apiKey`                                       |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`          | `authDomain`                                   |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`           | `projectId`                                    |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`       | `storageBucket` (e.g., `your-app.appspot.com`) |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`  | `messagingSenderId`                            |
| `NEXT_PUBLIC_FIREBASE_APP_ID`               | `appId`                                        |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`       | `measurementId` (This can be left empty if not used) |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID`              | Your PayPal App's Client ID                    |

---

## Part 2: Private Server-Side Variables

These are sensitive secrets for your application's backend services, like the Firebase Admin SDK and Genkit AI.

### How to Find Your Firebase Admin SDK Keys

These values come from the `service-account-key.json` file you downloaded from Firebase.

1.  Open your `service-account-key.json` file in a text editor.
2.  You will find `project_id`, `private_key`, and `client_email` inside it.

### Vercel Variable Configuration (Private)

Add these to Vercel's Environment Variables. **Ensure they do NOT have the `NEXT_PUBLIC_` prefix.**

| Vercel Variable Name      | Value Source (from `service-account-key.json`)                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `FIREBASE_PROJECT_ID`     | The value of `project_id`.                                                                                                                     |
| `FIREBASE_CLIENT_EMAIL`   | The value of `client_email`.                                                                                                                   |
| `FIREBASE_PRIVATE_KEY`    | The value of `private_key`. **IMPORTANT:** You must copy the entire key, including the `-----BEGIN...` and `-----END...` parts, and then replace all newline characters (`\n`) with the literal characters `\n`. |
| `GEMINI_API_KEY`          | Your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).                                                                    |
| `PAYPAL_SECRET`           | Your PayPal App's Secret Key from the PayPal Developer Dashboard.                                                                              |


### Example `FIREBASE_PRIVATE_KEY` Formatting

When you copy the private key from the `.json` file, it looks like this:

```
-----BEGIN PRIVATE KEY-----\nYourKeyPart1\nYourKeyPart2\n-----END PRIVATE KEY-----\n
```

When you paste this into Vercel, it might strip the `\n`. You must ensure the final value in Vercel looks like this, with the literal `\n` characters preserved:

`-----BEGIN PRIVATE KEY-----\nYourKeyPart1\nYourKeyPart2\n-----END PRIVATE KEY-----\n`

---

After adding all these variables, **redeploy** your application on Vercel to apply the changes.
