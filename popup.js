document.getElementById('btn').onclick = () => {
  const val = document.getElementById('txt').value;
  if (val) {
    chrome.runtime.sendMessage({ action: "manualSend", text: val });
    window.close();
  }
};