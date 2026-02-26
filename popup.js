document.getElementById('sendBtn').onclick = () => {
  const val = document.getElementById('noteInput').value;
  if (val) {
    chrome.runtime.sendMessage({ action: "manualSend", text: val });
    window.close();
  }
};
