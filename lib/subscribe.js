const awsIot = require('aws-iot-device-sdk');
const moment = require('moment'); // for DateTime formatting
const username = 'MyGitHubUserName' // TODO: replace this

const device = awsIot.device({
   keyPath: 'certificates/private.pem.key',
  certPath: 'certificates/certificate.pem.crt',
    caPath: 'certificates/ca.pem',
  clientId: `${username}-subscribe`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

device.on('connect', () => {
  console.log('Subscriber client connected to AWS IoT cloud.\n');

  device.subscribe('divashenTopic');

  console.log('Publisher client connected to AWS IoT cloud.\n');

  device.publish('divashenTopic', JSON.stringify({
    testMessage: "SomeMessage",
  }));

  // TODO subscribe to more topics here
});

device.on('message', (topic, payload) => {

  let message = JSON.parse(payload.toString());


  switch (topic) {
    case 'makers/challenge/tokens':
      let tokenExpiry = moment(message.expiresAt).format('MMMM Do YYYY, h:mm:ss a')
      console.log(`New answer token received: "${message.answerToken}", expires ${tokenExpiry}\n`)
      break;

    default:
      console.log(`Message received on topic "${topic}:"\n\n${JSON.stringify(message)}`)
  }
});

