'use strict';
const utils = require('./_utils');

exports.welcome = function welcome(app) {
    let now = new Date();
    let offset = now.getTimezoneOffset(); // always gives 0...

    app.ask(`Now is ${now}. Hello!}`,
        utils.NO_INPUTS);
}