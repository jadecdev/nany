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
const utils = require('./utils');
const cats = require('./cats');

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;
const functions = require('firebase-functions');

// API.AI actions
const UNRECOGNIZED_DEEP_LINK = 'deeplink.unknown';
const TELL_FACT = 'tell.fact';
const TELL_CAT_FACT = 'tell.cat.fact';
const WELCOME = 'input.welcome';

const FACT_TYPE = {
    HISTORY: 'history',
    HEADQUARTERS: 'headquarters',
    CATS: 'cats'
};

const HISTORY_FACTS = new Set([
    'Google was founded in 1998.',
    'Google was founded by Larry Page and Sergey Brin.',
    'Google went public in 2004.',
    'Google has more than 70 offices in more than 40 countries.'
]);

const HQ_FACTS = new Set([
    'Google\'s headquarters is in Mountain View, California.',
    'Google has over 30 cafeterias in its main campus.',
    'Google has over 10 fitness facilities in its main campus.'
]);

const GOOGLE_IMAGES = [
    [
        'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Search_GSA.2e16d0ba.fill-300x300.png',
        'Google app logo'
    ],
    [
        'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Google_Logo.max-900x900.png',
        'Google logo'
    ],
    [
        'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Dinosaur-skeleton-at-Google.max-900x900.jpg',
        'Stan the Dinosaur at Googleplex'
    ],
    [
        'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Wide-view-of-Google-campus.max-900x900.jpg',
        'Googleplex'
    ],
    [
        'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Bikes-on-the-Google-campus.2e16d0ba.fill-300x300.jpg',
        'Biking at Googleplex'
    ]
];

const LINK_OUT_TEXT = 'Learn more';
const GOOGLE_LINK = 'https://www.google.com/about/';

// Say a fact
function tellFact(app) {
    let historyFacts = app.data.historyFacts
        ? new Set(app.data.historyFacts) : HISTORY_FACTS;
    let hqFacts = app.data.hqFacts ? new Set(app.data.hqFacts) : HQ_FACTS;

    if (historyFacts.size === 0 && hqFacts.size === 0) {
        app.tell('Actually it looks like you heard it all. ' +
            'Thanks for listening!');
        return;
    }

    let factCategory = app.getArgument(utils.CATEGORY_ARGUMENT);

    if (factCategory === FACT_TYPE.HISTORY) {
        let fact = utils.getRandomFact(historyFacts);
        if (fact === null) {
            if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
                let suggestions = ['Headquarters'];
                if (!app.data.catFacts || app.data.catFacts.length > 0) {
                    suggestions.push('Cats');
                }
                app.ask(app.buildRichResponse()
                    .addSimpleResponse(noFactsLeft(app, factCategory, FACT_TYPE.HEADQUARTERS))
                    .addSuggestions(suggestions));
            } else {
                app.ask(noFactsLeft(app, factCategory, FACT_TYPE.HEADQUARTERS),
                    utils.NO_INPUTS);
            }
            return;
        }

        let factPrefix = 'Sure, here\'s a history fact. ';
        app.data.historyFacts = Array.from(historyFacts);
        if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
            let image = getRandomImage(GOOGLE_IMAGES);
            app.ask(app.buildRichResponse()
                .addSimpleResponse(factPrefix)
                .addBasicCard(app.buildBasicCard(fact)
                    .addButton(LINK_OUT_TEXT, GOOGLE_LINK)
                    .setImage(image[0], image[1]))
                .addSimpleResponse(utils.NEXT_FACT_DIRECTIVE)
                .addSuggestions(utils.CONFIRMATION_SUGGESTIONS));
        } else {
            app.ask(factPrefix + fact + utils.NEXT_FACT_DIRECTIVE, utils.NO_INPUTS);
        }
        return;
    } else if (factCategory === FACT_TYPE.HEADQUARTERS) {
        let fact = getRandomFact(hqFacts);
        if (fact === null) {
            if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
                let suggestions = ['History'];
                if (!app.data.catFacts || app.data.catFacts.length > 0) {
                    suggestions.push('Cats');
                }
                app.ask(app.buildRichResponse()
                    .addSimpleResponse(noFactsLeft(app, factCategory, FACT_TYPE.HISTORY))
                    .addSuggestions(suggestions));
            } else {
                app.ask(noFactsLeft(app, factCategory, FACT_TYPE.HISTORY), utils.NO_INPUTS);
            }
            return;
        }

        let factPrefix = 'Okay, here\'s a headquarters fact. ';
        app.data.hqFacts = Array.from(hqFacts);
        if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
            let image = getRandomImage(GOOGLE_IMAGES);
            app.ask(app.buildRichResponse()
                .addSimpleResponse(factPrefix)
                .addBasicCard(app.buildBasicCard(fact)
                    .setImage(image[0], image[1])
                    .addButton(LINK_OUT_TEXT, GOOGLE_LINK))
                .addSimpleResponse(utils.NEXT_FACT_DIRECTIVE)
                .addSuggestions(utils.CONFIRMATION_SUGGESTIONS));
        } else {
            app.ask(factPrefix + fact + utils.NEXT_FACT_DIRECTIVE, utils.NO_INPUTS);
        }
        return;
    } else {
        // Conversation repair is handled in API.AI, but this is a safeguard
        if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
            app.ask(app.buildRichResponse()
                .addSimpleResponse(`Sorry, I didn't understand. I can tell you about \
Google's history, or its  headquarters. Which one do you want to \
hear about?`)
                .addSuggestions(['History', 'Headquarters']));
        } else {
            app.ask(`Sorry, I didn't understand. I can tell you about \
Google's history, or its headquarters. Which one do you want to \
hear about?`, utils.NO_INPUTS);
        }
    }
}


// Say they've heard it all about this category
function noFactsLeft(app, currentCategory, redirectCategory) {
    let parameters = {};
    parameters[utils.CATEGORY_ARGUMENT] = redirectCategory;
    // Replace the outgoing facts context with different parameters
    app.setContext(utils.FACTS_CONTEXT, utils.DEFAULT_LIFESPAN, parameters);
    let response = `Looks like you've heard all there is to know \
about the ${currentCategory} of Google. I could tell you about its \
${redirectCategory} instead. `;
    if (!app.data.catFacts || app.data.catFacts.length > 0) {
        response += 'By the way, I can tell you about cats too. ';
    }
    response += `So what would you like to hear about?`;
    return response;
}

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


function welcome(app) {
    let now = new Date();

    app.ask(`Now is ${now}. Hello! ${now.getTimezoneOffset()}`,
        utils.NO_INPUTS);
}


exports.babysitter = functions.https.onRequest((request, response) => {
    const app = new App({request, response});
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));


    let actionMap = new Map();
    actionMap.set(UNRECOGNIZED_DEEP_LINK, unhandledDeepLinks);
    actionMap.set(TELL_FACT, tellFact);
    actionMap.set(TELL_CAT_FACT, cats.tellCatFact);
    actionMap.set(WELCOME, welcome);

    app.handleRequest(actionMap);
});
