// content.js
(() => {
  // Function to serialize form elements
  function getFormElements() {
    const elements = [];
    const inputs = Array.from(document.querySelectorAll('select'));

    inputs.filter(el => el.type !== 'hidden').forEach(element => {
      const elemData = {
        label: getLabel(element),
        options: null,
        selector: getUniqueSelector(element)
      };

      if (element.tagName.toLowerCase() === 'select') {
        elemData.options = [];
        for (const option of element.options) {
          elemData.options.push({
            value: option.value,
            text: option.text
          });
        }
      }

      elements.push(elemData);
    });

    return elements;
  }

  // Function to get associated label text
  function getLabel(element) {
    let labelText = null;
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) labelText = label.innerText;
    }
    if (!labelText) {
      // Check parent elements
      let parent = element.parentElement;
      while (parent) {
        if (parent.tagName.toLowerCase() === 'label') {
          labelText = parent.innerText;
          break;
        }
        parent = parent.parentElement;
      }
    }
    return labelText;
  }

  // Function to generate a unique selector for an element
  function getUniqueSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }
    if (element.name) {
      return `[name="${element.name}"]`;
    }
    const path = [];
    while (element.parentElement) {
      const index = Array.from(element.parentElement.children).indexOf(element) + 1;
      path.unshift(`${element.tagName.toLowerCase()}:nth-child(${index})`);
      element = element.parentElement;
    }
    return path.join(' > ');
  }

  const formElements = getFormElements();

  // Send the form elements to the background script
  formElements.forEach(element => {
    chrome.runtime.sendMessage({ action: "sendSelect", data: element });
  })
})();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('in here')
  if (request.action === "fillSelect") {
    console.log(request.data)
    const item = request.data;
    // Loop through the data and fill out form fields
    const element = document.querySelector(item.selector);
    element.value = item.choice;
    // Trigger change event if needed
    const event = new Event('change', { bubbles: true });
    element.dispatchEvent(event);
  }
});
