;(function(ROT) {
    'use strict';

    var KEYS = {
        up: 38,
        down: 40,
        left: 37,
        right: 39
    };


    function Two() {
        this.mapWidth = 80;
        this.mapHeight = 25;
        ROT.DEFAULT_WIDTH = this.mapWidth;
        ROT.DEFAULT_HEIGHT = this.mapHeight;

        this.display = new ROT.Display({
            fontSize: 28,
            fontFamily: "'Inconsolata', monospace"
        });

        this.maps = {};
        this.map = null;
        this.floor = null;

        this.player = new Player(this);

        this.scheduler = new ROT.Scheduler.Simple();
        this.scheduler.add(this.player, true);
        this.engine = new ROT.Engine(this.scheduler);
    }

    Two.prototype = {
        start: function() {
            document.getElementById('container').appendChild(this.display.getContainer());
            this.enterFloor(0);
            var p = parseCoords(chooseRand(this.map.open));
            this.player.x = p.x;
            this.player.y = p.y;
            this.draw();
            this.engine.start();
        },

        enterFloor: function(floor) {
            this.floor = floor;
            if (!this.maps[floor]) {
                this.maps[floor] = this.generateMap();
            }
            this.map = this.maps[floor];
        },

        generateMap: function() {
            var digger = new ROT.Map.Digger();
            var map = emptyMap(this.mapWidth, this.mapHeight);
            digger.create(function(x, y, val) {
                if (val) {
                    return;
                }

                map.tiles[x][y] = '.';
                map.open.push(coords(x, y));
            });

            return map;
        },

        draw: function() {
            this.drawMap();
            this.player.draw();
        },

        drawMap: function() {
            forEachTile(this.map.tiles, function(x, y, value) {
                if (value) {
                    this.display.draw(x, y, value);
                }
            }, this);
        }
    };


    function Player(two) {
        this.two = two;
        this.x = 0;
        this.y = 0;
    }

    Player.prototype = {
        draw: function() {
            this.two.display.draw(this.x, this.y, '@', '#FF0');
        },

        act: function() {
            this.two.engine.lock();
            window.addEventListener('keydown', this);
        },

        handleEvent: function(e) {
            var dx = 0;
            var dy = 0;

            if (e.keyCode === KEYS.up) {
                dy = -1;
            } else if (e.keyCode === KEYS.down) {
                dy = 1;
            } else if (e.keyCode === KEYS.left) {
                dx = -1;
            } else if (e.keyCode === KEYS.right) {
                dx = 1;
            }

            var newX = this.x + dx;
            var newY = this.y + dy;
            if (this.two.map.open.indexOf(coords(newX, newY)) !== -1) {
                this.two.display.draw(this.x, this.y,
                                      this.two.map.tiles[this.x][this.y]);
                this.x = newX;
                this.y = newY;
                this.draw();
            }

            window.removeEventListener('keydown', this);
            this.two.engine.unlock();
        }
    };


    // jQuery? Pah! Multiple listeners? PAH!
    window.onload = function() {
        window.two = new Two();
        two.start();
    };


    // Utils
    function emptyMap(width, height) {
        var map = {open: [], tiles: []};
        for (var x = 0; x < width; x++) {
            map.tiles.push([]);
            for (var y = 0; y < height; y++) {
                map.tiles[x].push(false);
            }
        }
        return map;
    }

    function forEachTile(map, callback, ctx) {
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[x].length; y++) {
                callback.call(ctx, x, y, map[x][y]);
            }
        }
    }

    function randMax(max) {
        return Math.floor(ROT.RNG.getUniform() * max);
    }

    function chooseRand(list) {
        return list[randMax(list.length)];
    }

    function parseCoords(coords) {
        var parts = coords.split(',');
        return {
            x: parseInt(parts[0], 10),
            y: parseInt(parts[1], 10)
        };
    }

    function coords(x, y) {
        return x + ',' + y;
    }
})(ROT);
