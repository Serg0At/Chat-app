📱 Telegram Verification Workflow
1. Registration Flow (Frontend)

User fills form:

fullName

username

profilePic (optional)

phoneNumber (required)

password, etc.

After submit, frontend calls:

POST /api/auth/register


Body:

{
  "fullName": "John Doe",
  "username": "johndoe",
  "phone": "+37499123456",
  "password": "******"
}


Backend saves user as pending:

{
  id: 123,
  fullName: "John Doe",
  username: "johndoe",
  phone: "+37499123456",
  status: 'pending'
}


Backend generates verification token (UUID or JWT).
Example: abcdef123456.

Frontend shows "Verify by Telegram" button with deep link:

https://t.me/MyCoolBot?start=abcdef123456

2. Telegram Bot Flow

User clicks the link → opens Telegram → /start abcdef123456.

Bot receives the /start with abcdef123456.

Bot calls backend:

POST /api/auth/verify/start


Body:

{
  "token": "abcdef123456",
  "telegramUserId": 987654321,
  "telegramPhone": "+37499123456"  // only if user shared phone with bot
}


Backend checks:

Does this token exist?

Does user’s phone in DB == telegramPhone from bot?

3. Success Case

✅ If phone matches:

Backend marks user verified = true.

Backend generates login token (XYZ).

Bot sends user a button:

[✅ Verification Successful → Open App](https://yourapp.com/verified?token=XYZ)


When user clicks → app frontend calls:

POST /api/auth/verify/complete


Body:

{
  "token": "XYZ"
}


Backend issues access + refresh JWT → frontend saves them → redirect to dashboard.

4. Failure Case

❌ If telegramPhone not provided or doesn’t match DB:

Bot replies:

Your Telegram phone number does not match the one you registered with.
Please update your account or contact support.


No verification token is returned.

🔒 Security Notes

abcdef123456 (start param) should be one-time-use + short expiry (5-10 min).

Final login token (XYZ) should also be single-use → only for redirect.

Always verify phone number against DB, don’t trust just Telegram username.