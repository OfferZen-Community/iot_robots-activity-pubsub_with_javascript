// run with `node publish.js ANSWER_TOKEN "YOUR ANSWER"`

const awsIot = require('aws-iot-device-sdk');
const username = 'Dan';

const answerToken = process.argv[2];
if(!answerToken) { 
  console.log("Missing script parameter: ANSWER_TOKEN");
  process.exit(1);
}

const answer = process.argv[3];
if(!answer) { 
  console.log("Missing script parameter: ANSWER");
  process.exit(1);
}

let device = awsIot.device({
   keyPath: 'certificates/private.pem.key',
  certPath: 'certificates/certificate.pem.crt',
    caPath: 'certificates/ca.pem',
  clientId: `${username}-publish`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

const topicNamespace = 'makers/challenge';

device.on('connect', () => {
  console.log('Publisher client connected to AWS IoT cloud.');

  device.publish(`${topicNamespace}/answers`, JSON.stringify({
      'name': username,
      'answerToken': answerToken,
      'answer': answer
  }));

  console.log(`Published answer to ${topicNamespace}/answers.\n`)

  setTimeout(() => { process.exit(0) }, 3000);
});
