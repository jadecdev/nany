/**
 * Created by Jade on 01/07/2017.
 */
'use strict';
const utils = require('./_utils');

const CAT_IMAGE = [
    'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
    'Gray Cat'
];

const CATS_LINK = 'https://www.google.com/search?q=cats';

const CAT_FACTS = new Set([
    'Cats are animals.',
    'Cats have nine lives.',
    'Cats descend from other cats.',
    'Cats are the cutest of all.'
]);

const LINK_OUT_TEXT = 'Learn more';
const CAT_CONTEXT = 'choose_cats-followup';


// This sample uses a sound clip from the Actions on Google Sound Library
// https://developers.google.com/actions/tools/sound-library
const MEOW_SRC = 'https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg';

// Say a cat fact
exports.tellCatFact = function (app) {
    let catFacts = app.data.catFacts ? new Set(app.data.catFacts) : CAT_FACTS;
    let fact = utils.getRamdomFacts(catFacts);
    if (fact === null) {
        // Add facts context to outgoing context list
        app.setContext(utils.FACTS_CONTEXT, utils.DEFAULT_LIFESPAN, {});
        // Replace outgoing cat-facts context with lifespan = 0 to end it
        app.setContext(utils.CAT_CONTEXT, utils.END_LIFESPAN, {});
        if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
            app.ask(app.buildRichResponse()
                .addSimpleResponse('Looks like you\'ve heard all there is to know ' +
                    'about cats. Would you like to hear about Google?', utils.NO_INPUTS)
                .addSuggestions(exports.CONFIRMATION_SUGGESTIONS));
        } else {
            app.ask('Looks like you\'ve heard all there is to know ' +
                'about cats. Would you like to hear about Google?', utils.NO_INPUTS);
        }
        return;
    }

    app.data.catFacts = Array.from(catFacts);
    let factPrefix =
        `Alright, here's a cat fact. <audio src="${MEOW_SRC}"></audio>`;
    if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
        app.ask(app.buildRichResponse()
            .addSimpleResponse(`<speak>${factPrefix}</speak>`)
            .addBasicCard(app.buildBasicCard(fact)
                .setImage(CAT_IMAGE[0], CAT_IMAGE[1])
                .addButton(LINK_OUT_TEXT, CATS_LINK))
            .addSimpleResponse(utils.NEXT_FACT_DIRECTIVE)
            .addSuggestions(utils.CONFIRMATION_SUGGESTIONS), utils.NO_INPUTS);
    } else {
        app.ask(`<speak>${factPrefix} ${fact} ${utils.NEXT_FACT_DIRECTIVE}</speak>`,
            utils.NO_INPUTS);
    }
    return;
}
