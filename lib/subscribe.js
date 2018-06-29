const awsIot = require('aws-iot-device-sdk');
const moment = require('moment'); // for DateTime formatting
const username = 'MyGitHubUserName' // TODO: replace this
const net = require('net')

const device = awsIot.device({
   keyPath: 'certificates/private.pem.key',
  certPath: 'certificates/certificate.pem.crt',
    caPath: 'certificates/ca.pem',
  clientId: `${username}-subscribe`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});
var ip = '192.168.88.186'

    var c = new net.Socket(); 
    c.connect(1337, ip, function() {
        console.log('Connected to ' + ip);
    });


    c.on('close', function() {
        console.log('Connection closed');
    });

var sphero = require("sphero");
//var spheroId = process.argv[2];
var spheroId = "F5:77:55:BE:40:A2"
var orb = sphero(spheroId);
var ip = '192.168.88.186'

console.log('trying to connect to sphero...');

var orbConnected = true
orb.connect(async function () {
	console.log('connected to sphero')

	
	orb.startCalibration();
	await orb.color("red").delay(5000)
	orb.finishCalibration()
	
	orb.color("green");


    console.log("calibrated - ready to roll")

	orbConnected = true

});


device.on('connect', () => {
  console.log('Subscriber client connected to AWS IoT cloud.\n');

  device.subscribe('divashenTopic');
  device.subscribe('calibrate');

  console.log('Publisher client connected to AWS IoT cloud.\n'); 
});
var isCalibrating = false
  
function calibrate(){
   if(!isCalibrating) {
	  	c.write('orb.color("red")')
		c.write('orb.startCalibration()'); 
   } else {
	   	c.write('orb.finishCalibration()')
		c.write('orb.color("green")')
   }
	
	isCalibrating = !isCalibrating
}

function moveAround(payload) {
  let message = JSON.parse(payload.toString());
  //console.log(JSON.stringify(message))
  
  if(!!!message.acceleration) {
	  return
  }
  
  var x = parseFloat(message.acceleration.x) * -1
  var y = parseFloat(message.acceleration.y)
  //console.log(message.location)
  if(isNaN(x) || isNaN(y)) {
	  return
  }
  

  //console.log(`Message received on topic "${topic}:"\n\n${JSON.stringify(message)}`)     

  //console.log("X:", x, "Y:", y)

  var direction = (Math.atan2(y, x) * 180 / Math.PI)
  //console.log(direction)

  direction = (direction + 360) % 360
  var magnitude = Math.sqrt(Math.pow(y,2) + Math.pow(x,2))
  //console.log(magnitude)
  //console.log(direction)
  if(orbConnected && magnitude > 1) {
	  //orb.roll(magnitude * 10, direction)
	    c.write(`orb.roll(${magnitude * 10}, ${direction})`);

  }
}


device.on('message', function(topic, payload) {
	//console.log(topic)  
	
	switch(topic) {
				case 'divashenTopic':
					if(!isCalibrating){ 
						moveAround(payload)
					}
					break;
				case 'calibrate':
					calibrate()
					break;
				}
});

