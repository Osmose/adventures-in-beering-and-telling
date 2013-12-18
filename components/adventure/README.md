# adventure.js

A web-based text adventure system. Rather simple and limited.

You should check out a [sample game](https://github.com/Osmose/sample-adventure) 
that uses most of the features of the library, and has a nice template to use
for your game.

## Example

```javascript
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
})();
```

## Features

- Movement in cardinal directions.
- Track which rooms have been visited.
- Simple inventory.
- Simple score tracking.

## License

Copyright (c) 2013 Michael Kelly

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
