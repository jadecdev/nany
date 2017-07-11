'use strict';
const utils = require('./_utils');

exports.welcome = function welcome(app) {
    const permission = app.SupportedPermissions.DEVICE_PRECISE_LOCATION;
    // app.askForPermission('To get your city', permission);
    app.tell(`<speak version="1.1" 
    xmlns="http://www.w3.org/2001/10/synthesis"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.w3.org/2001/10/synthesis
    http://www.w3.org/TR/speech-synthesis11/synthesis.xsd"
       xml:lang="en-US">
       
       Once upon a time there was an old mother pig who had three little pigs and not enough food to feed them. <voice gender="male">So when they were old enough,</voice> she sent them out into the world to seek their fortunes.

    <emphasis>The first little pig was very lazy</emphasis>. <p xml:lang="fr">He didn't want to work at all </p> and he built his house out of straw. <voice age="6">The second little pig worked a little bit harder </voice> but he was somewhat lazy too and he built his house out of sticks. Then, they sang and danced and played together the rest of the day.

    <s><prosody volume="+6dB">The third little pig </prosody></s> worked hard all day and built his house with bricks. It was a sturdy house complete with a fine fireplace and chimney. It looked like it could withstand the strongest winds.

        The next day, a wolf happened to pass by the lane where the three little pigs lived; and he saw the straw house, and he smelled the pig inside. He thought the pig would make a mighty fine meal and his mouth began to water.

        So he knocked on the door and said:

        "Little pig! Little pig!
    Let me in! Let me in!"
    But the little pig saw the wolf's big paws through the keyhole, so he answered back:

    "No! No! No!
    Not by the hairs on my chinny chin chin!"
    Three Little Pigs straw houseThen the wolf showed his teeth and said:

        Then I'll huff
    and I'll puff
    and I'll blow your house down."
    So he huffed and he puffed and he blew the house down! The wolf opened his jaws very wide and bit down as hard as he could, but the first little pig escaped and ran away to hide with the second little pig.

        The wolf continued down the lane and he passed by the second house made of sticks; and he saw the house, and he smelled the pigs inside, and his mouth began to water as he thought about the fine dinner they would make.

        So he knocked on the door and said:

        "Little pigs! Little pigs!
    Let me in! Let me in!"
    But the little pigs saw the wolf's pointy ears through the keyhole, so they answered back:

    "No! No! No!
    Not by the hairs on our chinny chin chin!"
    So the wolf showed his teeth and said:

        "Then I'll huff
    and I'll puff
    and I'll blow your house down."
    So he huffed and he puffed and he blew the house down! The wolf was greedy and he tried to catch both pigs at once, but he was too greedy and got neither! His big jaws clamped down on nothing but air and the two little pigs scrambled away as fast as their little hooves would carry them.

        The wolf chased them down the lane he almost caught them. But they made it to the brick house and slammed the door closed before the wolf could catch them. The three little pigs they were very frightened, they knew the wolf wanted to eat them. And that was very, very true. The wolf hadn't eaten all day and he had worked up a large appetite chasing the pigs around and now he could smell all three of them inside and he knew that the three little pigs would make a lovely feast.

    Three Little Pigs brick house

    So the wolf knocked on the door and said:

        "Little pigs! Little pigs!
    Let me in! Let me in!"
    But the little pigs saw the wolf's narrow eyes through the keyhole, so they answered back:

    "No! No! No!
    Not by the hairs on our chinny chin chin!"
    So the wolf showed his teeth and said:

        "Then I'll huff
    and I'll puff
    and I'll blow your house down."
    Well! he huffed and he puffed. He puffed and he huffed. And he huffed, huffed, and he puffed, puffed; but he could not blow the house down. At last, he was so out of breath that he couldn't huff and he couldn't puff anymore. So he stopped to rest and thought a bit.

        But this was too much. The wolf danced about with rage and swore he would come down the chimney and eat up the little pig for his supper. But while he was climbing on to the roof the little pig made up a blazing fire and put on a big pot full of water to boil. Then, just as the wolf was coming down the chimney, the little piggy off with the lid, and plump! in fell the wolf into the scalding water.

        So the little piggy put on the cover again, boiled the wolf up, and the three little pigs ate him for supper.

                                                                                                                  Three Little Pigs wolf into pot.
           </speak>
                                                                                                                  `);
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