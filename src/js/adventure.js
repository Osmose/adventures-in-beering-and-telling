;(function() {
    function Adventure(rootElement, startRoom) {
        var adventure = this;

        this.root = rootElement;
        this.root.className += ' adventure';

        this.rooms = {};

        this.output = document.createElement('div');
        this.output.className = 'output';

        // Create text input.
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('autofocus', 'autofocus');
        this.input.addEventListener('keydown', function(e) {
            if (e.keyCode === 13) {
                var command = this.value.trim();
                this.value = '';
                adventure.parseCommand(command);
                window.scroll(0, document.body.clientHeight);
                e.stopPropagation();
            }
        }, false);

        // Put the input in a container (for styling purposes).
        this.inputContainer = document.createElement('div');
        this.inputContainer.className = 'input';
        this.inputContainer.appendChild(this.input);

        this.root.appendChild(this.output);
        this.root.appendChild(this.inputContainer);

        // If the user clicks anywhere, focus on the input while preserving
        // their current scroll position.
        window.addEventListener('click', function() {
            var x = window.scrollX;
            var y = window.scrollY;
            adventure.input.focus();
            window.scroll(x, y);
        }, false);

        // Setup adventure state.
        this.currentRoomId = startRoom || 'start';
        this.inventory = [];
        this.visited = {};
        this.score = 0;
    }

    Adventure.prototype = {
        room: function(id, look, options) {
            options = options || {};

            var room = {
                id: id,
                look: look,
                north: options.north || null,
                south: options.south || null,
                east: options.east || null,
                west: options.west || null,
                extraCommands: options.extraCommands || {},
                synonyms: options.synonyms || {},
                itemFunctions: options.items || {},
                items: [],
                takeMessages: {}
            };

            for (var key in room.itemFunctions) {
                if (room.itemFunctions.hasOwnProperty(key)) {
                    room.items.push(key);
                }
            }

            this.rooms[id] = room;
        },

        start: function() {
            this.look();
        },

        parseCommand: function(command) {
            this.say('> ' + command, 'player-input');

            for (var key in this.currentRoom.extraCommands) {
                if (this.currentRoom.extraCommands.hasOwnProperty(key) &&
                    command.indexOf(key) === 0) {
                    this.currentRoom.extraCommands[key](command);
                    return;
                }
            }

            for (key in this.currentRoom.synonyms) {
                if (this.currentRoom.synonyms.hasOwnProperty(key) &&
                    command.indexOf(key) === 0) {
                    this.currentRoom.extraCommands[this.currentRoom.synonyms[key]](command);
                    return;
                }
            }

            for (key in Adventure.commandMap) {
                if (Adventure.commandMap.hasOwnProperty(key) &&
                    command.indexOf(key) === 0) {
                    this[Adventure.commandMap[key]](command);
                    return;
                }
            }

            // Haven't run anything, guess we don't understand it.
            this.say('Huh? What\'s "' + command + '"?');
        },

        say: function(str, className) {
            var p = document.createElement('p');
            if (className) {
                p.className = className;
            }
            p.innerHTML = str;
            this.output.appendChild(p);
            return p;
        },

        prompt: function(str, callback) {
            this.say(str);
            var prompt = this.say('(Press any key to continue)', 'prompt');

            remove(this.inputContainer);

            function promptListener(e) {
                document.removeEventListener('keydown', promptListener, false);
                remove(prompt);
                callback();
            }
            document.addEventListener('keydown', promptListener, false);
        },

        get currentRoom() {
            return this.rooms[this.currentRoomId];
        },

        setCurrentRoom: function(roomId) {
            this.currentRoomId = roomId;
            this.look();
        },

        endGame: function(megafail) {
            remove(this.inputContainer);
            this.say('Game Over');

            var score = megafail ? 'Awful' : this.score;
            this.say('Final score: ' + score);
        },

        go: function(direction) {
            direction = removePrefixes(direction, 'go');
            if (this.currentRoom[direction]) {
                this.setCurrentRoom(this.currentRoom[direction]);
            } else {
                this.say('I couldn\'t move that way.');
            }
        },

        take: function(item) {
            item = removePrefixes(item, 'take', 'get', 'grab');

            var i = this.currentRoom.items.indexOf(item);
            if (i !== -1) {
                this.currentRoom.items.splice(i, 1);
                this.inventory.push(item);
                this.currentRoom.itemFunctions[item]();
            } else {
                this.say('I couldn\'t find "' + item + '".');
            }
        },

        look: function() {
            this.currentRoom.look();
            this.visited[this.currentRoomId] = true;
        },

        hasVisited: function(id) {
            return this.visited[id];
        },

        playerHas: function(item) {
            return this.inventory.indexOf(item) !== -1;
        }
    };

    Adventure.commandMap = {
        north: 'go',
        south: 'go',
        east: 'go',
        west: 'go',
        go: 'go',
        look: 'look',
        take: 'take',
        get: 'take',
        grab: 'take'
    };

    // Utility functions
    function remove(node) {
        node.parentNode.removeChild(node);
    }

    function removePrefixes(text) {
        for (var k = 1; k < arguments.length; k++) {
            var prefix = arguments[k];
            if (text.indexOf(prefix) === 0) {
                text = text.slice(prefix.length).trim();
                return text;
            }
        }
        return text;
    }

    window.Adventure = Adventure;
})();
