// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendSelect") {
    console.log(request.data)
    fetch("http://localhost:8000/autocompletes/selects", {
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
        chrome.tabs.sendMessage(sender.tab.id, { action: "fillSelect", data: data });
      })
      .catch(error => console.error("Error:", error));
  } else if (request.action === "sendRadios") {
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
        chrome.tabs.sendMessage(sender.tab.id, { action: "fillRadios", data: data });
      })
      .catch(error => console.error("Error:", error));
  }
});
