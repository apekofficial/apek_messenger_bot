var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
        	if (event.message.text === 'options') {
        		ApekMessage(event.sender.id)
        	} else {
        		sendMessage(event.sender.id, {text: "type options for more info"});		
        	}
        } 
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }

    });
};

function ApekMessage(recipientId) {
       var spotifyUrl = 'https://open.spotify.com/artist/6jNwV0P142cXxXanOl9Ylo';
       var tourUrl = 'http://www.apekofficial.com/schedule';
       var buttonImage = 'http://static1.squarespace.com/static/54dbed24e4b07ca77377bc9b/t/56c9017c4c2f85180fb7597d/1456013711515/APEK+PRESS+SHOT.jpg?format=2500w';
            
            var message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "APEK",
                            "subtitle": "Hey! This is APEK, thanks for the message. Click the buttons below for more info!",
                            "image_url": buttonImage,
                            "buttons": [{
                                "type": "web_url",
                                "url": spotifyUrl,
                                "title": "Follow me on Spotify"
                                }, {
                                "type": "web_url",
                                "url": tourUrl,
                                "title": 'Tour Dates',
                            }]
                        }]
                    }
                }
            };
    
            sendMessage(recipientId, message);
};
