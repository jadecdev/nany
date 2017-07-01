'use strict';
const utils = require('./_utils');

exports.welcome = function welcome(app) {
    let now = new Date();

    app.ask(`Now is ${now}. Hello! ${now.getTimezoneOffset()}`,
        utils.NO_INPUTS);
}