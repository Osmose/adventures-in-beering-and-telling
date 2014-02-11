;(function(ROT, makeColor) {
    'use strict';

    var KEYS = {
        up: 38,
        down: 40,
        left: 37,
        right: 39
    };

    var DEFAULT_COLOR = '#EEE';
    var COLORS = {
        '.': '#EEE',
        '@': '#FF0',
        '!': '#F0F'
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
        this.needsRedraw = true;
        this.entities = [];
        this.visibleCoords = [];

        this.player = new Player(this);

        this.fov = new ROT.FOV.PreciseShadowcasting(this.lightPasses.bind(this));

        this.scheduler = new ROT.Scheduler.Speed();
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

        addEntity: function(Type) {
            var entity = new Type(this);
            var p = parseCoords(chooseRand(this.map.open));
            entity.x = p.x;
            entity.y = p.y;
            this.entities.push(entity);
            this.scheduler.add(entity, true);
        },

        enterFloor: function(floor) {
            for (var k = 0; k < this.entities.length; k++) {
                this.scheduler.remove(this.entities[k]);
            }
            this.entities = [];

            this.floor = floor;
            if (!this.maps[floor]) {
                this.maps[floor] = this.generateMap();
            }
            this.map = this.maps[floor];

            var entityCount = random(3, 9);
            for (k = 0; k < entityCount; k++) {
                this.addEntity(Popup);
            }
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

        lightPasses: function(x, y) {
            return this.inBounds(x, y) && this.map.tiles[x][y] == '.';
        },

        inBounds: function(x, y) {
            return x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight;
        },

        passable: function(x, y) {
            if (this.map.tiles[x][y] != '.') {
                return false;
            }

            return true;
        },

        draw: function() {
            if (this.needsRedraw) {
                this.display.clear();
                this.drawMap();
                this.player.draw();
                for (var k = 0; k < this.entities.length; k++) {
                    var entity = this.entities[k];
                    if (this.visibleCoords.indexOf(coords(entity.x, entity.y)) !== -1) {
                        entity.draw();
                    }
                }
                this.needsRedraw = false;
            }
        },

        drawMap: function() {
            for (var k = 0; k < this.map.seen.length; k++) {
                var pos = parseCoords(this.map.seen[k]);
                var tile = this.map.tiles[pos.x][pos.y];
                this.display.draw(pos.x, pos.y, tile, color(tile).darken(6 / 8).rgbString());
            }

            this.visibleCoords = [];
            this.fov.compute(this.player.x, this.player.y, 8, this.drawTile.bind(this));
        },

        drawTile: function(x, y, r, visibility) {
            var c = coords(x, y);
            this.visibleCoords.push(c);
            if (this.map.seen.indexOf(c) === -1) {
                this.map.seen.push(c);
            }

            var tile = this.map.tiles[x][y];
            this.display.draw(x, y, tile, color(tile).darken((r - 2) / 8).rgbString());
        }
    };


    function Player(two) {
        this.two = two;
        this.x = 0;
        this.y = 0;
    }

    Player.prototype = {
        draw: function() {
            this.two.display.draw(this.x, this.y, '@', COLORS['@']);
        },

        act: function() {
            this.two.engine.lock();
            this.two.draw(); // Draw once it's time for player interaction again.
            window.addEventListener('keydown', this);
        },

        getSpeed: function() {
            return 100;
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
            } else {
                return;
            }

            var newX = this.x + dx;
            var newY = this.y + dy;
            if (this.two.passable(newX, newY)) {
                this.x = newX;
                this.y = newY;
                this.two.needsRedraw = true;
            }

            window.removeEventListener('keydown', this);
            this.two.engine.unlock();
        }
    };


    function Popup(two) {
        this.two = two;
        this.x = 0;
        this.y = 0;
    }

    Popup.prototype = {
        getSpeed: function() {
            return 50;
        },

        draw: function() {
            this.two.display.draw(this.x, this.y, '!', COLORS['!']);
        },

        act: function() {
            // Only bother if the player is within a straight line range.
            var player = this.two.player;
            if (this.two.visibleCoords.indexOf(coords(this.x, this.y)) !== -1) {
                var path = astarPath(this.x, this.y, player.x, player.y,
                                     this.two.passable.bind(this.two), {topology: 4});
                path.shift();
                if (path.length > 0) {
                    this.x = path[0].x;
                    this.y = path[0].y;
                    this.two.needsRedraw = true;
                }
            }
        }
    };


    // jQuery? Pah! Multiple listeners? PAH!
    window.onload = function() {
        window.two = new Two();
        two.start();
    };


    // Utils
    function emptyMap(width, height) {
        var map = {open: [], tiles: [], seen: []};
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

    function random(min, max) {
        return Math.floor(ROT.RNG.getUniform() * (max - min)) + min;
    }

    function chooseRand(list) {
        return list[random(0, list.length)];
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

    function color(tile) {
        return COLORS[tile] ? makeColor(COLORS[tile]) : makeColor(DEFAULT_COLOR);
    }

    function astarPath(startX, startY, endX, endY, passable, opts) {
        var astar = new ROT.Path.AStar(endX, endY, passable, opts);
        var path = [];
        astar.compute(startX, startY, function(x, y) {
            console.log('test');
            path.push({x: x, y: y});
        });

        return path;
    }
})(ROT, Color);
