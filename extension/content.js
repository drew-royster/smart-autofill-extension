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

        function findLabelForGroup(radioGroupElement) {
            if (!radioGroupElement) return null;
            const label = radioGroupElement.querySelector('label');
            if (label) {
                return label; // Direct child label
            }
            // Check previous sibling elements for a matching label
            let sibling = radioGroupElement.previousElementSibling;
            while (sibling) {
                if (sibling.tagName.toLowerCase() === 'label') {
                    return sibling;
                }
                sibling = sibling.previousElementSibling;
            }
            return null;
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
                    radioGroups[name].radios.push(radio);
                    radioGroups[name].options.push(radio.value);
                    radioGroups[name].selector = getUniqueSelector(radio);
                }
            });

            for (const name in radioGroups) {
                if (radioGroups[name].radios.length > 0) {
                    const commonParent = radioGroups[name].radios[0].closest('fieldset') || radios[0].closest('div');
                    const groupLabel = findLabelForGroup(commonParent);
                    if (groupLabel) {
                        radioGroups[name].label = (groupLabel.textContent || groupLabel.innerText);
                    }
                }
            }

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

        const selects = getSelects();
        const groupedRadios = groupRadioButtonsWithLabels();

        // Send the form elements to the background script
        selects.forEach(element => {
            chrome.runtime.sendMessage({action: "sendSelect", data: element});
        })
        for (let name in groupedRadios) {
            chrome.runtime.sendMessage({
                    action: "sendRadios",
                    data: {
                        label: groupedRadios[name].label,
                        options: groupedRadios[name].options,
                        selector: groupedRadios[name].selector
                    }
                }
            );
        }
    }
)
();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('in here')
    if (request.action === "fillSelect") {
        console.log(request.data)
        const item = request.data;
        // Loop through the data and fill out form fields
        const element = document.querySelector(item.selector);
        element.value = item.choice;
        // Trigger change event if needed
        const event = new Event('change', {bubbles: true});
        element.dispatchEvent(event);
    }
});
