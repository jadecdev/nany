'use strict';
const utils = require('./_utils');

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
exports.tellFact = function tellFact(app) {
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
        let fact = utils.getRamdomFacts(historyFacts);
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
            let image = utils.getRandomImage(GOOGLE_IMAGES);
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
        let fact = utils.getRamdomFacts(hqFacts);
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
            let image = utils.getRandomImage(GOOGLE_IMAGES);
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
};

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
