// content.js
(() => {
        // Function to serialize form elements
        function getSelects() {
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


        function groupRadioButtonsWithLabels() {
            const radios = document.querySelectorAll('input[type="radio"]');
            const radioGroups = {};

            radios.forEach(radio => {
                const name = radio.name;
                if (name) {
                    if (!radioGroups[name]) {
                        radioGroups[name] = {radios: [], label: null, options: []};
                    }
                    radioGroups[name].options.push({value: radio.value, selector: getUniqueSelector(radio)});
                }
            });

            return radioGroups;
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
            const path = [];
            while (element.parentElement) {
                const index = Array.from(element.parentElement.children).indexOf(element) + 1;
                path.unshift(`${element.tagName.toLowerCase()}:nth-child(${index})`);
                element = element.parentElement;
            }
            return path.join(' > ');
        }

        const selects = getSelects();
        const groupedRadios = groupRadioButtonsWithLabels();

        // Send the form elements to the background script
        selects.forEach(element => {
            chrome.runtime.sendMessage({action: "sendSelect", data: element});
        })
        for (let name in groupedRadios) {
            chrome.runtime.sendMessage({
                    action: "sendRadio",
                    data: {
                        options: groupedRadios[name].options
                    }
                }
            );
        }
    }
)
();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillSelect") {
        console.log(request.data)
        const item = request.data;
        // Loop through the data and fill out form fields
        const element = document.querySelector(item.selector);
        element.value = item.choice;
        // Trigger change event if needed
        const event = new Event('change', {bubbles: true});
        element.dispatchEvent(event);
    } else if (request.action === "fillRadio") {
        console.log(request.data)
        const item = request.data;
        // Loop through the data and fill out form fields
        const element = document.querySelector(item.selector);
        element.checked = true;
        // Trigger change event if needed
        const event = new Event('change', {bubbles: true});
        element.dispatchEvent(event);
    }
});
