// Deploy to Supabase Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");
const CLIENT_SECRET = "YOUR_CUSTOM_PASSWORD"; 

serve(async (req) => {
  const { type, content, source, secret } = await req.json();

  if (secret !== CLIENT_SECRET) return new Response("Forbidden", { status: 403 });

  if (type === 'image') {
    // Check if Base64
    if (content.startsWith('data:image')) {
      // Base64 requires a multipart upload to Telegram
      const base64Data = content.split(',')[1];
      const binary = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      const formData = new FormData();
      formData.append('chat_id', CHAT_ID!);
      formData.append('photo', new Blob([binary], { type: 'image/jpeg' }), 'image.jpg');
      formData.append('caption', `🖼️ Base64 Image from: ${source}`);

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: formData
      });
    } else {
      // Standard URL
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, photo: content, caption: `🖼️ URL Image from: ${source}` })
      });
    }
  } else {
    // Text Chunking (4000 chars)
    const chunks = content.match(/[\s\S]{1,4000}/g) || [];
    for (const chunk of chunks) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: `📌 *Snippet:*\n\n${chunk}\n\n🌐 *Source:* ${source}`,
          parse_mode: 'Markdown'
        })
      });
    }
  }

  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
});