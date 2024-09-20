import ollama from 'ollama'

const selectInput = [{"tag":"select","type":"select-one","name":"job_application[gender]","id":"job_application_gender","class":null,"placeholder":null,"label":"Gender","options":[{"value":"","text":"Please select"},{"value":"1","text":"Male"},{"value":"2","text":"Female"},{"value":"3","text":"Decline To Self Identify"}],"selector":"#job_application_gender"},{"tag":"select","type":"select-one","name":"job_application[hispanic_ethnicity]","id":"job_application_hispanic_ethnicity","class":null,"placeholder":null,"label":"Are you Hispanic/Latino?","options":[{"value":"","text":"Please select"},{"value":"Yes","text":"Yes"},{"value":"No","text":"No"},{"value":"Decline To Self Identify","text":"Decline To Self Identify"}],"selector":"#job_application_hispanic_ethnicity"},{"tag":"select","type":"select-one","name":"job_application[race]","id":"job_application_race","class":null,"placeholder":null,"label":"\n    Please identify your race\n","options":[{"value":"","text":"Please select"},{"value":"1","text":"American Indian or Alaskan Native"},{"value":"2","text":"Asian"},{"value":"3","text":"Black or African American"},{"value":"4","text":"Hispanic or Latino"},{"value":"5","text":"White"},{"value":"6","text":"Native Hawaiian or Other Pacific Islander"},{"value":"7","text":"Two or More Races"},{"value":"8","text":"Decline To Self Identify"}],"selector":"#job_application_race"},{"tag":"select","type":"select-one","name":"job_application[veteran_status]","id":"job_application_veteran_status","class":null,"placeholder":null,"label":"Veteran Status","options":[{"value":"","text":"Please select"},{"value":"1","text":"I am not a protected veteran"},{"value":"2","text":"I identify as one or more of the classifications of a protected veteran"},{"value":"3","text":"I don't wish to answer"}],"selector":"#job_application_veteran_status"},{"tag":"select","type":"select-one","name":"job_application[disability_status]","id":"job_application_disability_status","class":null,"placeholder":null,"label":"Disability Status","options":[{"value":"","text":"Please select"},{"value":"1","text":"Yes, I have a disability, or have had one in the past"},{"value":"2","text":"No, I do not have a disability and have not had one in the past"},{"value":"3","text":"I do not want to answer"}],"selector":"#job_application_disability_status"}]


selectInput.forEach(async (element) => {
  const response = await ollama.generate({
    model: 'qwen2.5-coder',
    prompt: `I am a not disabled. I am a white non hispanic male. I am not a veteran. Given this element please return the appropriate option in the format {"value":"1","text":"Male"}: ${JSON.stringify(element)}`,
    stream: false,
    format: 'json'
  })
  console.log({selector: element.selector, option: response.response})
})



