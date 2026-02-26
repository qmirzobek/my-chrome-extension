const PROXY_URL = "https://your_id.supabase.co/functions/v1/your_edge_function";
const SECRET_KEY = "YOUR_SHAREABLE_SUPABASE_KEY"; // Match this in your Edge Function

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: "sendText", title: "Send Text", contexts: ["selection"] });
  chrome.contextMenus.create({ id: "sendImage", title: "Send Image", contexts: ["image"] });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendText") {
    sendToProxy({ type: 'text', content: info.selectionText, source: tab.url });
  } else if (info.menuItemId === "sendImage") {
    // If it's a data:image (Base64), we send the string. If it's a URL, we send the URL.
    sendToProxy({ type: 'image', content: info.srcUrl, source: tab.url });
  }
});

chrome.runtime.onMessage.addListener((req) => {
  if (req.action === "manualSend") sendToProxy({ type: 'text', content: req.text, source: 'Manual Entry' });
});

async function sendToProxy(payload) {
  try {
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret: SECRET_KEY })
    });
    if (!response.ok) throw new Error("Backend failed");
    console.log("Sent successfully!");
  } catch (e) {
    console.error("Communication Error:", e);
  }
}
