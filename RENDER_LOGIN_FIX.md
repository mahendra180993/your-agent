# Fix "Network error" on Login (Render server setting)

Your backend is running (e.g. `/health` works), but the **frontend is still calling `localhost`** for the API. Fix it by setting one variable on Render so the **build** uses your real URL.

---

## Do this on Render

### 1. Open your service

1. Go to **https://dashboard.render.com**
2. Open your **Web Service** (e.g. `your-agent` or `your-agent-5ti9`).

### 2. Add the API URL variable

1. Click **Environment** in the left sidebar.
2. Click **Add Environment Variable**.
3. Set:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://your-agent-5ti9.onrender.com/api`  
     *(Use YOUR actual URL. Replace `your-agent-5ti9` with your service name if different. No trailing slash.)*
4. Click **Save Changes**.

### 3. Redeploy

- Render will redeploy automatically after saving, **or**
- Go to **Manual Deploy** → **Deploy latest commit** to start a new build.

### 4. Wait and test

- Wait for the deploy to finish (Build + Deploy).
- Open **https://your-agent-5ti9.onrender.com/admin/login** and try logging in again with your **ADMIN_EMAIL** and **ADMIN_PASSWORD** (same as in Render env).

---

## Why this works

The frontend is built with **Vite**. It reads `VITE_API_BASE_URL` **during the build**. If that variable is set on Render to your app URL, the built JavaScript will call your server instead of `localhost:5000`, so login and chat will work.

---

## Checklist

- [ ] `VITE_API_BASE_URL` added on Render (your full URL + `/api`)
- [ ] Save Changes clicked
- [ ] New deploy completed
- [ ] `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET` are set on Render
- [ ] Login tried again after deploy
