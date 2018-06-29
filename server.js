const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser');

const awsIot = require('aws-iot-device-sdk');
const username = 'MyGitHubUserName' // TODO: replace this

const device = awsIot.device({
   keyPath: 'certificates/private.pem.key',
  certPath: 'certificates/certificate.pem.crt',
    caPath: 'certificates/ca.pem',
  clientId: `${username}-publish`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

device.on('connect', () => {
  console.log('Publisher client connected to AWS IoT cloud.\n');

  device.publish('divashenTopic', JSON.stringify({
    testMessage: "SomeMessage"
  }));
});

app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, 'public')))
app.post('/publish', function(request, response) {
  console.log(request.body)
  response.send('Shot dude')
})
app.listen(3000, () => console.log('Example app listening on port 5000!'))