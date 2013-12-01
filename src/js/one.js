;(function() {
    var adv = new Adventure(document.getElementById('adventure'), 'start');

    adv.room('start', function() {
        adv.say('You are in a dark room. There is a door to the north.');
    }, {
        north: 'door'
    });

    adv.room('door', function() {
        adv.say("There is a door in front of you. The dark room is to the south.");
    }, {
        south: 'start'
    });

    adv.start();
})();
