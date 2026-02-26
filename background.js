const TELEGRAM_BOT_TOKEN = 'TELEGRAM_BOT_TOKEN';
const TELEGRAM_USER_ID = 'TELEGRAM_CHAT_ID';
const MAX_LENGTH = 4000; // Telegram limit is 4096; git 4000 is safer

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToTelegram",
    title: "Send to Telegram",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendToTelegram") {
    const header = `📌 *Snippet from:* ${tab.url}\n\n`;
    sendToTelegram(header + info.selectionText);
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "manualSend") {
    sendToTelegram(`📝 *Manual Note:*\n\n${request.text}`);
  }
});

async function sendToTelegram(fullText) {
  // 1. Split text into chunks
  const chunks = [];
  for (let i = 0; i < fullText.length; i += MAX_LENGTH) {
    chunks.push(fullText.substring(i, i + MAX_LENGTH));
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  // 2. Send chunks one by one
  for (let i = 0; i < chunks.length; i++) {
    const partLabel = chunks.length > 1 ? `\n\n(Part ${i + 1}/${chunks.length})` : '';
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_USER_ID,
          text: chunks[i] + partLabel,
          parse_mode: 'Markdown'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Telegram API Error:", error);
        // If Markdown fails (e.g., weird characters), try sending as plain text
        if (error.description.includes("can't parse entities")) {
            await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: TELEGRAM_USER_ID,
                    text: chunks[i] + partLabel
                })
            });
        }
      }
    } catch (e) {
      console.error("Network Error:", e);
    }
    
    // Small delay to prevent hitting Telegram's rate limits (30 msgs per second)
    if (chunks.length > 1) await new Promise(r => setTimeout(r, 200));
  }
}