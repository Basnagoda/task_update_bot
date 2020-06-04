const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

const hooksURL = 'https://hooks.slack.com/services/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';   // Huubap Team-D workspace webhooks #test-slashcmd1 channel (can be changed inside Slack Dashboard)

app.use(bodyParser.urlencoded({extended: false}));


app.use('/reply', (req, res, next) => {
    let result = JSON.parse(req.body.payload);

    console.log("Hello!!!", result);


    /* sample payload */
    /*
    {
        type: 'interactive_message',
        actions: [ { name: 'yes', type: 'button', value: 'yes' } ],
        callback_id: 'button_tutorial',
        team: { id: 'T014QUMV70S', domain: 'huubap-team-d' },
        channel: { id: 'C014M20566S', name: 'test-slashcmd1' },
        user: { id: 'U014J7GLKCN', name: 'willys' },
        action_ts: '1591257334.565202',
        message_ts: '1591257294.004400',
        attachment_id: '1',
        token: '3eZ4OZDYLXu4JiCTR8IRpA7r',
        is_app_unfurl: false,
        original_message: {
          type: 'message',
          subtype: 'bot_message',
          text: 'This is your first interactive message',
          ts: '1591257294.004400',
          bot_id: 'B014SCE7E05',
          attachments: [ [Object] ]
        },
        response_url: 'https://hooks.slack.com/actions/T014QUMV70S/1176513277985/1czGgb4umqbo8p7CkNToQhMU',
        trigger_id: '1170069492868.1160973993026.d3fd69dda43b42bb38d69e4ae4bd42c7'
      }
    */


    res.json({text: `your answer is: ${result.actions[0].value}`});
});

app.use('/questions', (req, res, next) => {
        var message = {
            "text": "This is your first interactive message",
            "attachments": [
                {
                    "text": "Building buttons is easy right?",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "button_tutorial",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "yes",
                            "text": "yes",
                            "type": "button",
                            "value": "yes"
                        },
                        {
                            "name": "no",
                            "text": "no",
                            "type": "button",
                            "value": "no"
                        },
                        {
                            "name": "maybe",
                            "text": "maybe",
                            "type": "button",
                            "value": "maybe",
                            "style": "danger"
                        }
                    ]
                }
            ]
        }

    sendMessageToSlackResponseURL(hooksURL, message, res);
});



function sendMessageToSlackResponseURL(hooksURL, JSONmessage, response){
    var postOptions = {
        url: hooksURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        data: JSONmessage
    }
    axios(postOptions)
        .then(res => {
            console.log('axios_res..... ');
            response.json();
        })
        .catch(err => {console.log('err..... ', err)})
}

const server = http.createServer(app);
server.listen(3000);