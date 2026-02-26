# My Chrome Extension: Send-to-Self Bot

A lightweight Chrome Extension that allows you to highlight any text on the web and instantly send it to yourself via a Telegram Bot. Powered by **Supabase Edge Functions** for secure, serverless message routing.

---

## Features
* **Context Menu Integration:** Right-click any selected text to send.
* **Secure Backend:** Uses Supabase Edge Functions to hide your Bot Token from the frontend.
* **Instant Delivery:** Get your notes, links, or snippets on Telegram immediately.

---

## Project Structure
* `/extension`: The Chrome Extension source files (Manifest v3).
* `/supabase-backend`: The TypeScript Edge Function to be deployed to Supabase.

---

## Setup Instructions

### 1. Telegram Bot Setup
1. Message [@BotFather](https://t.me/botfather) on Telegram to create a new bot.
2. Copy your **API Token**.
3. Message [@userinfobot](https://t.me/userinfobot) to get your **Chat ID**.

### 2. Backend (Supabase) Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Install the Supabase CLI and login.
3. Deploy the edge function:
   ```bash
   supabase functions deploy send-message --project-ref your-project-id

4. Set your secrets in the Supabase Dashboard:

TELEGRAM_BOT_TOKEN: Your API Token from BotFather.

TELEGRAM_CHAT_ID: Your Chat ID.

### Extension Setup
Clone this repository.

Create a .env file based on .env.example and add your Supabase URL and Anon Key.

Open Chrome and go to chrome://extensions.

Enable Developer Mode.

Click Load unpacked and select the /extension folder.

### Environment Variables
Refer to .env.example for the required keys.

Note: Never commit your actual .env file to GitHub.

### License
This project is licensed under the MIT License.