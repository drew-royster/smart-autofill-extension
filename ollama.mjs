import ollama from 'ollama'

const selectInput = {
  "tag": "select",
  "type": "select-one",
  "name": "eeo[veteran]",
  "id": null,
  "class": null,
  "placeholder": null,
  "label": "Veteran status\nSelect ...\nI am a veteran\nI am not a veteran\nDecline to self-identify",
  "options": [
    {
      "value": "",
      "text": "Select ..."
    },
    {
      "value": "I am a veteran",
      "text": "I am a veteran"
    },
    {
      "value": "I am not a veteran",
      "text": "I am not a veteran"
    },
    {
      "value": "Decline to self-identify",
      "text": "Decline to self-identify"
    }
  ]
}


const response = await ollama.generate({
  model: 'llama3.1',
  prompt: `Take these options and return the the option which says I'm not a veteran: ${JSON.stringify(selectInput.options)}`,
  stream: false,
  format: 'json'
})
console.log(response.response)

