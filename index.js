import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import ollama from "ollama";
import e from "express";

const app = express();
const port = 3001;

// Middleware to parse JSON
// Increase the limit to 10MB
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());

const chooseGenderOption = async (genderSelect) => {
  const response = await ollama.generate({
    model: 'codegemma:2b',
    prompt: `Take these options and return the the option which says I'm a male: ${JSON.stringify(genderSelect.options)}`,
    stream: false,
    format: 'json'
  })
  return {
    selector: genderSelect.selector,
    choice: response.response,
    type: 'select'
  }
}

const chooseRaceOption = async (select) => {
  const response = await ollama.generate({
    model: 'codegemma:2b',
    prompt: `Take these options and return the the option which says I'm white: ${JSON.stringify(select.options)}`,
    stream: false,
    format: 'json'
  })
  return {
    selector: select.selector,
    choice: response.response,
    type: 'select'
  }
}

const chooseVeteranOption = async (select) => {
  const response = await ollama.generate({
    model: 'codegemma:2b',
    prompt: `Take these options and return the the option which says I'm not a veteran: ${JSON.stringify(select.options)}`,
    stream: false,
    format: 'json'
  })
  return {
    selector: select.selector,
    choice: response.response,
    type: 'select'
  }
}

// POST route to receive JSON
app.post('/data', async (req, res) => {
  const receivedData = req.body;

  // console.log(receivedData.elements)

  // const checkboxes = receivedData.elements.filter(element => element.type === 'checkbox');
  const selects = receivedData.elements.filter(element => element.tag === 'select');
  // const inputs = receivedData.elements.filter(element => element.tag === 'input');

  const eventsToFill = await Promise.all(selects.map(async (element) => {
    const response = await ollama.generate({
      model: 'qwen2.5-coder',
      prompt: `I am not disabled. I am a white. I am not hispanic. I am a male. I am not a veteran. Given this element, please return the appropriate option in the format {"value":"1","text":"Male"}: ${JSON.stringify(element)}`,
      stream: false,
      format: 'json'
    });

    return {
      selector: element.selector,
      choice: response.response
    };
  }));
  res.send(eventsToFill);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
