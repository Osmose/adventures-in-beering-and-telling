;(function() {
    var adventures = {
        one: 'js/one.js'
    };

    var adventure = window.location.search.substring(1);
    if (adventures.hasOwnProperty(adventure)) {
        document.title = adventure + ' - Adventures in Beering and Telling';
        toast(adventures[adventure]);
    } else {
        document.getElementById('adventure').innerHTML = (
            '<p>Sorry, your adventure is in another castle.</p>');
    }
})();
