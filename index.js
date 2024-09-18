import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import ollama from "ollama";
import e from "express";

const app = express();
const port = 3000;

// Middleware to parse JSON
// Increase the limit to 10MB
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());

const chooseGenderOption = async (genderSelect) => {
  const response = await ollama.generate({
    model: 'llama3.1',
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
    model: 'llama3.1',
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
    model: 'llama3.1',
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

  const eventsToFill = [];
  // console.log(selects);
  const selectGender = selects.find(select => select.label.toLowerCase().includes('Gender'.toLowerCase()));
  if (selectGender) {
    const genderResponse = await chooseGenderOption(selectGender);
    eventsToFill.push(genderResponse);
  }
  const selectRace = selects.find(select => select.label.toLowerCase().includes('Race'.toLowerCase()));
  if (selectRace) {
    const raceResponse = await chooseRaceOption(selectRace);
    eventsToFill.push(raceResponse);
  }
  const selectVeteran = selects.find(select => select.label.toLowerCase().includes('Veteran'.toLowerCase()));
  if (selectVeteran) {
    const veteranResponse = await chooseVeteranOption(selectVeteran);
    eventsToFill.push(veteranResponse);
  }
  res.send(eventsToFill);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
