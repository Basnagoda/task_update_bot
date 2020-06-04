const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const taskUpdateChannelURL = require('./hooks');


const app = express();

app.use(bodyParser.json());


app.use('/reply', (req, res, next) => {
    console.log("Interactive Component is Triggered !!!!!");
    res.json({message: "OK"});

    // sendMessageToSlackResponseURL(taskUpdateChannelURL.huubap_task_update, {"text": "some summary"}, res);

});

// app.use('/questions', (req, res, next) => {
//         var message = {
//             "text": "This is your first interactive message",
//             "attachments": [
//                 {
//                     "text": "Building buttons is easy right?",
//                     "fallback": "Shame... buttons aren't supported in this land",
//                     "callback_id": "button_tutorial",
//                     "color": "#3AA3E3",
//                     "attachment_type": "default",
//                     "actions": [
//                         {
//                             "name": "yes",
//                             "text": "yes",
//                             "type": "button",
//                             "value": "yes"
//                         },
//                         {
//                             "name": "no",
//                             "text": "no",
//                             "type": "button",
//                             "value": "no"
//                         },
//                         {
//                             "name": "maybe",
//                             "text": "maybe",
//                             "type": "button",
//                             "value": "maybe",
//                             "style": "danger"
//                         }
//                     ]
//                 }
//             ]
//         }

//     sendMessageToSlackResponseURL(hooksURL, message, res);
// });


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