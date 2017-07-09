// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
const utils = require('./hooks/_utils');
const cats = require('./hooks/cats');
const welcome = require('./hooks/welcome');
const google = require('./hooks/google');

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;
const functions = require('firebase-functions');

// API.AI actions
const UNRECOGNIZED_DEEP_LINK = 'deeplink.unknown';
const TELL_FACT = 'tell.fact';
const TELL_CAT_FACT = 'tell.cat.fact';
const WELCOME = 'input.welcome';
const PERMISSION_CONFIRMATION = 'permission.confirmation';


// Greet the user and direct them to next turn
function unhandledDeepLinks(app) {
    if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
        app.ask(app.buildRichResponse()
            .addSimpleResponse(`Welcome to Facts about Google! I'd really rather \
not talk about ${app.getRawInput()}. Wouldn't you rather talk about \
Google? I can tell you about Google's history or its headquarters. \
Which do you want to hear about?`)
            .addSuggestions(['History', 'Headquarters']));
    } else {
        app.ask(`Welcome to Facts about Google! I'd really rather \
not talk about ${app.getRawInput()}. \
Wouldn't you rather talk about Google? I can tell you about \
Google's history or its headquarters. Which do you want to hear about?`,
            utils.NO_INPUTS);
    }
}


exports.babysitter = functions.https.onRequest((request, response) => {
    const app = new App({request, response});
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    let actionMap = new Map();
    actionMap.set(WELCOME, welcome.welcome);
    actionMap.set(PERMISSION_CONFIRMATION, welcome.confirm);

    actionMap.set(UNRECOGNIZED_DEEP_LINK, unhandledDeepLinks);
    actionMap.set(TELL_FACT, google.tellFact);
    actionMap.set(TELL_CAT_FACT, cats.tellCatFact);

    app.handleRequest(actionMap);

});
