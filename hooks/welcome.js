'use strict';
const utils = require('./_utils');

exports.welcome = function welcome(app) {
    const permission = app.SupportedPermissions.DEVICE_PRECISE_LOCATION;
    app.askForPermission('To get your city', permission);
};

exports.confirm = function welcome(app) {
    if (app.isPermissionGranted()) {
        let location = app.getDeviceLocation();
        if (location !== null) {
            console.log(location);
            let coordinates = location.coordinates;
            if (coordinates !== null) {
                let now = new Date();
                let offset = now.getTimezoneOffset(); // always gives 0...
                app.tell(`Now is ${now}. You live in ${coordinates.latitude};${coordinates.longitude}. Hello!`);
                return;
            }
        }
        app.tell('Error in location received');
    } else {
        app.tell('Sorry no permission');
    }
};