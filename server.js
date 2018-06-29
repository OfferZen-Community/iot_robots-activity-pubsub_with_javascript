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

app.use(bodyParser.json())

var deviceConnected = false
device.on('connect', () => {
  deviceConnected = true
})

app.use('/', express.static(path.join(__dirname, 'public')))
app.post('/publish', function(request, response) {
  if(deviceConnected) {
    // console.log('Publisher client connected to AWS IoT cloud.\n');
    console.log(request.body)
    device.publish('divashenTopic', JSON.stringify(request.body));
  }
  response.send('Shot dude')
})
app.listen(3000, () => console.log('Example app listening on port 5000!'))