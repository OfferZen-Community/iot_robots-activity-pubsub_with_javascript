const awsIot = require('aws-iot-device-sdk');
const moment = require('moment');
const username = 'Dan';

let device = awsIot.device({
   keyPath: 'certificates/private.pem.key',
  certPath: 'certificates/certificate.pem.crt',
    caPath: 'certificates/ca.pem',
  clientId: `${username}-subscribe`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

const topicNamespace = 'makers/challenge';
const topicNames = [
  'tokens', 'clues', 'answers',
  'answers/errors', 'answers/accepted'
];
const topics = topicNames.map((topic) => `${topicNamespace}/${topic}`)

device.on('connect', () => {
  console.log('Subscriber client connected to AWS IoT cloud.\n');

  topics.forEach((topic) => {
    device.subscribe(topic);
    console.log(`Subscribed to ${topic}.`);
  })

  console.log();
});


device.on('message', (topic, payload) => {

  let message = JSON.parse(payload.toString());

  switch (topic) {
    case `${topicNamespace}/tokens`:
      let tokenExpiry = moment(message.expiresAt).format('MMMM Do YYYY, h:mm:ssA');
      console.log(`<< A wild token appears! ${message.answerToken} (expires ${tokenExpiry})`);
      break;

    case `${topicNamespace}/clues`:
      console.log(`<< Clue ${message.clueIndex}/${message.totalClues}: ${message.clue}`);
      break;

    case `${topicNamespace}/answers`:
      if (message.name == username) {
        console.log(`>> You submitted an answer: ${message.answer} (token: ${message.answerToken})`);
      } else {
        console.log(`>> ${message.name} submitted an answer!`)
      }
      break;

    case `${topicNamespace}/answers/errors`: 
      if (message.answererName == username) {
        console.log(`<< Your answer was not accepted: ${message.error}`);
      } else {
        console.log(`<< ${message.answererName}'s answer had an error.`)
      }
      break;

    case `${topicNamespace}/answers/accepted`: 
      if (message.answererName == username) {
        console.log(`!! Congrats ${username}, you solved the puzzle !!`);
      } else {
        console.log(`!! ${message.answererName} solved the riddle !!`)
      }
      break;

    default:
      console.log(`<< Received message on unwatched topic: ${topic}`);
  }
});

