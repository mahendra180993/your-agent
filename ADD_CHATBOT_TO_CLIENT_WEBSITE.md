# How to Add This Chatbot to a Client's Website

Two steps: (1) **You** register the client’s site in the admin panel. (2) **The client** (or you) adds a small snippet to their website.

---

## Step 1: Register the client’s website (you, in Admin)

The chatbot only works for **hostnames you’ve added** as a client.

1. Log in to your admin: **https://your-agent-5ti9.onrender.com/admin/login**
2. Go to **Client Management**.
3. Click **Add Client**.
4. Fill in:
   - **Website:** The client’s **domain only** (no `https://` or path).  
     Examples: `www.clientcompany.com`, `clientcompany.com`, `shop.example.com`
   - **Business Type:** e.g. Technology, Retail, Healthcare
   - **System Prompt:** How the AI should behave (e.g. “You are a helpful support assistant for an online store.”)
   - **Tone:** e.g. friendly, professional, casual
   - **Welcome Message:** First message shown when the user opens the chat (e.g. “Hi! How can we help?”)
5. Click **Save**.

The **Website** value must match what the user’s browser sends: `window.location.hostname`. So if their site is `https://www.clientcompany.com`, use **`www.clientcompany.com`**. If it’s `https://clientcompany.com`, use **`clientcompany.com`**.

---

## Step 2: Add the script to the client’s website

The client (or you) adds this to **every page** where the chat should appear, **before** the closing `</body>` tag.

### Option A: Simple (one script tag)

Use your **actual** chatbot URL (replace `your-agent-5ti9` with your Render service name if different):

```html
<script>
  window.CHATBOT_CONFIG = {
    apiBaseUrl: 'https://your-agent-5ti9.onrender.com/api'
  };
</script>
<script src="https://your-agent-5ti9.onrender.com/chatbot.js"></script>
```

The first script sets the API URL so the widget talks to your server. The second loads the widget.

### Option B: With custom look (optional)

```html
<script>
  window.CHATBOT_CONFIG = {
    apiBaseUrl: 'https://your-agent-5ti9.onrender.com/api',
    position: 'bottom-right',    // or 'bottom-left'
    primaryColor: '#007bff',      // button/widget color (e.g. #2563eb, #059669)
    zIndex: 9999
  };
</script>
<script src="https://your-agent-5ti9.onrender.com/chatbot.js"></script>
```

### Where to put it in the HTML

Place both blocks **right before** `</body>`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Client's Website</title>
</head>
<body>
  <!-- page content -->

  <!-- Chatbot: paste here, before </body> -->
  <script>
    window.CHATBOT_CONFIG = {
      apiBaseUrl: 'https://your-agent-5ti9.onrender.com/api'
    };
  </script>
  <script src="https://your-agent-5ti9.onrender.com/chatbot.js"></script>
</body>
</html>
```

---

## If the client uses WordPress, Wix, Squarespace, etc.

- **WordPress:** Use a “Custom HTML” or “Code” block (before `</body>`), or a plugin that lets you inject code in the footer.
- **Wix / Squarespace / similar:** Use the “Embed” or “Code” / “HTML” widget and paste the two blocks (config + script tag) where they allow custom code (often footer).
- **Any builder:** Paste the same snippet in the place that outputs code “at the end of the page” or “before closing body”.

---

## Testing on localhost (e.g. http://localhost:3000)

1. **Add a client for localhost:** In Admin → Client Management, add a client with **Website** = `localhost` (no port). Save.
2. **Use your real API URL in the embed:** On your local page, set:
   ```html
   window.CHATBOT_CONFIG = { apiBaseUrl: 'https://your-agent-5ti9.onrender.com/api' };
   ```
   (Use your actual Render URL.)
3. If you see **"Sorry, I'm currently offline. Please try again later."**, the backend is reached but the **AI** failed (e.g. missing or invalid `OPENROUTER_API_KEY` on Render). Check Render → Environment and fix the key, then try again.
4. If you see **"Client not found or inactive"**, the **Website** in Admin must match exactly: use `localhost` (not `localhost:3000`).

---

## Checklist

- [ ] Client added in Admin with **Website** = exact hostname (e.g. `www.clientcompany.com` or `localhost` for local).
- [ ] Client’s site includes **both** the `CHATBOT_CONFIG` script and the `chatbot.js` script before `</body>`.
- [ ] `apiBaseUrl` in the config is **your** URL: `https://your-agent-5ti9.onrender.com/api`.

After that, the chat button should appear on the client’s site and messages will go to your backend and AI.
