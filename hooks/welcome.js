'use strict';
const utils = require('./_utils');

exports.welcome = function welcome(app) {
    const permission = app.SupportedPermissions.DEVICE_PRECISE_LOCATION;
    // app.askForPermission('To get your city', permission);


    app.tell(`<speak xml:lang="fr-FR">
  
       Once upon a time there was an old mother pig who had three little pigs and not enough food to feed them. 
       <voice gender="female" variant="2"> WORKING So when they were old enough,</voice> 
       she sent them out into the world to seek their fortunes.
    <break/> WORKING
    <emphasis> The first little pig was very lazy</emphasis>. <p xml:lang="fr">
    He didn't 
    <voice gender="male" variant="1">WORKING want to work at all </voice></p> and he built <voice gender="male" variant="2">his house out of straw.</voice>
     <voice age="6">The second little pig worked a little bit harder </voice> 
     but he was somewhat lazy too and he built his house out of sticks. Then, they sang and danced and played together the rest of the day.

    <prosody volume="+6dB">The third little pig </prosody>
    worked hard all day and built his house with bricks. 
        <p><s> WORKING The next day, a wolf happened to pass by the lane where the three little pigs lived;</s>
         <s>and he saw the straw house,</s>
         <s>and he smelled the pig inside.</s>
          </p>He thought the pig would make a mighty fine meal and his mouth began to water. 
          </speak>`);
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