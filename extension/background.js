// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendSelect") {
    fetch("http://localhost:8000/autocompletes/selects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request.data)
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        // Send the data back to the content script to fill out the form
        chrome.tabs.sendMessage(sender.tab.id, { action: "fillSelect", data: data });
      })
      .catch(error => console.error("Error:", error));
  } else if (request.action === "sendRadio") {
    console.log(request.data)
    fetch("http://localhost:8000/autocompletes/radios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request.data)
    })
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(data => {
        console.log(data)
        // Send the data back to the content script to fill out the form
        chrome.tabs.sendMessage(sender.tab.id, { action: "fillRadio", data: data });
      })
      .catch(error => console.error("Error:", error));
  }
});
