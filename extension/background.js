// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendFormElements") {
    fetch("http://localhost:3000/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ elements: request.data })
    })
      .then(response => response.json())
      .then(data => {
        // Send the data back to the content script to fill out the form
        chrome.tabs.sendMessage(sender.tab.id, { action: "fillForm", data: data });
      })
      .catch(error => console.error("Error:", error));
  }
});
