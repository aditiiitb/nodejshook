// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');

const app = express();

// [START hello_world]
// Say hello!
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === "thou_shall_pass") {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});
// [END hello_world]

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page. 
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook', function (req, res) {
  var data = req.body;
  console.log("In app post webhook");

  // Make sure this is a page subscription
  if (data.object === 'page') {
  	console.log("Got data object = page");
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});
  
function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  console.log("Message data: ", event.message);
}


if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
