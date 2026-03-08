# How to Create Another Admin User

You can have **multiple admin users** by creating them in the database. The app uses database users when MongoDB is connected; otherwise it falls back to the single admin from env vars (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

---

## Option 1: CLI script (recommended)

From the **backend** folder, run:

```bash
cd backend
npm run create-user -- <email> <password> <name> [role]
```

**Example – create a second admin:**

```bash
cd backend
npm run create-user -- secondadmin@example.com MySecurePass123 "Second Admin" admin
```

- **email** – login email (required)  
- **password** – at least 6 characters (required)  
- **name** – display name (required)  
- **role** – optional; default is `admin`. Allowed: `admin`, `manager`, `viewer`

The script connects to MongoDB using `MONGODB_URI` from `backend/.env`. The new user can log in at your app’s admin login page (e.g. `https://your-agent-5ti9.onrender.com/admin/login`) with that email and password.

---

## Option 2: Run the script with `node` directly

Still from the **backend** folder (so `backend/.env` is used):

```bash
cd backend
node scripts/create-user.js secondadmin@example.com MySecurePass123 "Second Admin" admin
```

---

## Option 3: Create user via API (when already logged in as admin)

If you are already logged in as an admin, you can create another user with the API:

```bash
# Replace YOUR_JWT_TOKEN with the token you get after login (e.g. from browser devtools / Application / Local Storage: admin_token)
# Replace the URL with your app URL if different
curl -X POST https://your-agent-5ti9.onrender.com/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"email":"newadmin@example.com","password":"SecurePass123","name":"New Admin","role":"admin"}'
```

---

## Notes

- **MongoDB must be set up** (e.g. MongoDB Atlas) and `MONGODB_URI` in `backend/.env` (or in Render env) must be correct. Database users are only used when the app is connected to MongoDB.
- If a user with that **email** already exists, the script will exit with an error.
- Passwords are hashed with bcrypt before being stored.
