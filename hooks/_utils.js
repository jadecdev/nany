'use strict';
//webhook : https://us-central1-ggl-template-apiai.cloudfunctions.net/babysitter
//ngrok : https://c5b411af.ngrok.io

// API.AI parameter names
exports.CATEGORY_ARGUMENT = 'category';

// API.AI Contexts/lifespans
exports.FACTS_CONTEXT = 'choose_fact-followup';
exports.END_LIFESPAN = 5;
exports.DEFAULT_LIFESPAN = 0;

exports.NO_INPUTS = [
    'I didn\'t hear that.',
    'If you\'re still there, say that again.',
    'We can stop here. See you soon.'
];

exports.NEXT_FACT_DIRECTIVE = ' Would you like to hear another fact?';
exports.CONFIRMATION_SUGGESTIONS = ['Sure', 'No thanks'];

exports.getRandomImage = function getRandomImage(images) {
    let randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
};

exports.getRamdomFacts = function getRandomFact(facts) {
    if (facts.size <= 0) {
        return null;
    }
    let randomIndex = (Math.random() * (facts.size - 1)).toFixed();
    let randomFactIndex = parseInt(randomIndex, 10);
    let counter = 0;
    let randomFact = '';
    for (let fact of facts.values()) {
        if (counter === randomFactIndex) {
            randomFact = fact;
            break;
        }
        counter++;
    }
    facts.delete(randomFact);
    return randomFact;
};