;(function() {
    var adv = new Adventure(document.getElementById('adventure'), 'start');

    function showEndMsg() {
        document.getElementById('endmsglink').href = 'https://wiki.mozilla.org/Webdev/Beer_And_Tell/December2013';
        document.getElementById('endmsg').className = 'show';
    }

    var intro = false;
    var hasAddon = false;
    adv.room('start', function() {
        if (!intro) {
            intro = true;
            adv.say("I can remember it like it was yesterday.");
            adv.say("It was a cold, rainy night. It always is. The story wouldn't be nearly as good if it happened on a sunny afternoon.");
            adv.say("I had known the client for years. She was a good friend; her family took me in when my own kicked me out. And even when I was on the streets, she was still there for me, giving me food and clothes, letting me stay on her couch when I wasn't out on the streets hustling for market share.");
            adv.say("It was a typical story: She was minding her own business, browsing a site someone had linked her to from an email, but she soon noticed some strange-looking ads. They seemed to know more about her than they should've, suggesting things like a present for her brother's birthday. How could they know that it was coming up?");
            adv.say("That's when she looked in her purse and noticed it: someone had slipper her a tracking cookie. And not just any tracking cookie, but an evercookie. The kind that you just can't get rid of.");
            adv.say("I had already given her Ghostery, which handled most other tracking cookies, but this one just wouldn't let go. I knew that we needed something different, and I knew where I could get it.");
            adv.say("I headed down to the Seventh Street webring. Browsers like me weren't always welcome down there; I saw a few 'Best Viewed with Internet Explorer 6' signs. Got a few glares, but I'd been through this dance before. I pulled out Quirks Mode, and people knew to leave me alone.");
        }

        var shop = "There was a closed-down user script shop near the entrance.";
        if (knowsWhereAddonIs && !hasAddon) {
            shop += " I noticed a small trashcan sitting outside the shop.";
        }

        adv.say("I was standing at the entrance to the Seventh Street webring. The dim lights reflected off the puddles in the alley. " + shop);
        adv.say("The alley continued north, deeper into the webring. South led back out the webring, but I still had business to take care of. Leaving then would've been nothing but trouble.");
    }, {
        north: 'outsideStore',
        south: 'utterFailure',
        extraCommands: {
            search: function(cmd) {
                if (cmd.indexOf('trash') === -1) {
                    adv.say("I couldn't find anything there. Maybe somewhere else?");
                } else if (hasAddon) {
                    adv.say("I searched the trash again, but couldn't find anything else useful");
                } else if (knowsWhereAddonIs) {
                    hasAddon = true;
                    adv.score += 100;
                    adv.say("I was no stranger to digging through the trash, and soon enough I found a beat-up looking addon. Just like the old browser said, it was a User-Agent spoofer. I configured it to mask me as Internet Explorer 6 and installed it.");
                } else {
                    adv.say("I didn't know what I was searching for, and couldn't find anything useful anyway.");
                }
            }
        },
        synonyms: {
            'examine': 'search',
            'look in': 'search',
            'check': 'search'
        },
    });

    adv.room('utterFailure', function() {
        adv.say("You think I'm the kind of guy who high-tails it when going gets tough? Buzz off! Get outta my face, you lowlife scum!");
        adv.endGame(true);
    });

    var outsideStoreFirstVisit = true;
    var triedToEnterStore = false;
    adv.room('outsideStore', function() {
        var extra = '';
        if (outsideStoreFirstVisit) {
            outsideStoreFirstVisit = false;
            adv.say("I moved deeper into the alleyway. The stench of &lt;FONT&gt;s wafted through the air. This place was bad news, but I'd seen worse.");
            adv.say("I stood in front of a badly-lit addon shop. This was where I needed to be; I had heard rumors the guy who ran this shop could find any addon. Obviously, this kind of service didn't come cheap.");
        } else {
            extra = "I was back outside the addon shop. ";
        }

        adv.say(extra + "I could've tried to enter the shop. North led further into the webring, while south led back to the webring entrance.");
    }, {
        south: 'start',
        north: 'outsideBar',
        extraCommands: {
            enter: function(cmd) {
                if (hasAddon) {
                    adv.say("This time, when I tried the door, it opened immediately. Finally, I could move on!");
                    adv.say("I walked into the store. The walls will filled with shelves stuffed with addons for almost anything you could imagine, from showing the prices for an item from other sites for comparison, to storing tabs in a tree-structure, to changing the menu icon into a hamburger.");
                    adv.say("As I headed to the back of the store, I heard an old man's voice call out to me. I saw a small man standing behind a counter waving to me. As I approached, I realized this was the merchant I had been told about. He was the one who could help me find an addon for my client.");
                    adv.say("So you're the one looking for an addon to get rid of an evercookie, eh?", 'potch');
                    adv.say("How do you know about that?", 'firefox');
                    adv.say("Young man, it's my business to know these things. How could I find an addon like this if I couldn't even find out a bit of news about you?", 'potch');
                    adv.say("But that doesn't matter. Seeing that you were able to get past my door, I'm willing to help you. You've proved to be a resourceful little browser, and I'm prepared to give you information on where to aquire this addon. In return, I expect you to do something for me.", 'potch');
                    adv.say("And what do you need me to do?", 'firefox');
                    adv.say("Hah! So eager! You need to relax, young man. What I want from you will be made clear later. For now, you should track down this addon for your client.", 'potch');
                    adv.prompt("He handed me a small business card and instructed me to visit the URL on the card to find what I was looking for. However, when I sent a request to the page, all I got back was a 302 redirect and a very odd response body that said...", function() {
                        showEndMsg();
                    });
                } else {
                    var firstBlock = !triedToEnterStore;

                    triedToEnterStore = true;
                    adv.score += 10;
                    adv.say("I tried to open the front door, but it wouldn't budge. When I pulled on the knob, a small message popped up in the window:");
                    adv.say("'We only support Internet Explorer 6'");
                    adv.say("It looked like the shop was actively blocking any User-Agent that didn't match IE6. I realized I'd need to fool the shop somehow before I could get in.");

                    if (firstBlock) {
                        adv.say("Lucky for me, I knew a guy who could help me out by the name of Mickey. At that hour he was usually hanging out at a bar down the webring a bit. I figured it'd be a good idea to pay him a visit.");
                    } else {
                        adv.say("I still needed to talk to Mickey about getting past the door.");
                    }
                }
            },
        },
        synonyms: {
            'open': 'enter',
        },
    });

    var outsideBarFirst = true;
    var talkedToHobo = false;
    var knowsWhereAddonIs = false;
    adv.room('outsideBar', function() {
        if (outsideBarFirst) {
            outsideBarFirst = false;
            adv.say("Near the back of the webring was a dingy bar. You could hear the awful auto-playing Midi music from the other end of the webring.");
            adv.say("I knew a guy by the name of Mickey who frequented the bar. Most nights you could find him in some corner, lying his head off about some recent startup or Facebook app he was working on. But for all his faults, he knew this part of town better than anyone.");

            adv.say("Outside the bar there were some old text-based browsers scrounging the garbage for market share.");
        } else {
            adv.say("I was in front of the bar. The music was still blaring, and those browsers were still digging through the dirt.");
        }

        var extra = 'Otherwise it was a dead end.';
        if (mickeyDone) {
            extra = "I also could've tried talking to the old browsers.";
        }
        adv.say("I could've entered the bar, or going south would've led back to the addon shop. " + extra);
    }, {
        south: 'outsideStore',
        extraCommands: {
            enter: function(cmd) {
                adv.setCurrentRoom('insideBar');
            },
            talk: function() {
                if (knowsWhereAddonIs) {
                    adv.say("I didn't have a reason to talk to the old browser anymore. He had mentioned he hid the addon somewhere near the user script shop.");
                } else if (!mickeyDone) {
                    adv.say("I had better things to do than talk to some old washed-up browsers.");
                } else if (!talkedToHobo) {
                    talkedToHobo = true;
                    adv.say("I walked over to the old browsers and called out.");
                    adv.say("Any of you seen an addon for User-Agent headers?", 'firefox');
                    adv.say("A particularly grubby-looking one nearly tripped as he ran over, beaming at me in a half-crazy way.");
                    adv.say("Yes sir! Yeah sir! I saw it! I took an addon just like that the other day!", 'lynx');
                    adv.say("Where is it now?", 'firefox');
                    adv.say("I hid it, yes I did! But man, is my memory getting a bit corrupted in my old age. I can't remember where!", 'lynx');
                    adv.say("If there was anything I had learned living in this town, it was that the cure for amnesia was a well-placed bribe.");
                } else {
                    adv.say("I walked over to the old browser from before. He eyed me suspiciously, but kept on digging around. Clearly he had decided I wasn't worth his time. Perhaps some money would loosen his lips.");
                }
            },
            bribe: function() {
                if (knowsWhereAddonIs) {
                    adv.say("I had already bribed the browser, I didn't need anything more from him.");
                } else if (!talkedToHobo) {
                    adv.say("Why would I do that? I didn't have any reason to bribe anyone... yet.");
                } else {
                    knowsWhereAddonIs = true;
                    adv.score += 50;
                    adv.say("I threw a few Satoshis on the ground, and the old browser pounced on them before the others could get close.");
                    adv.say("You know, I'm feeling a little better now. I seem to remember leaving the addon somewhere near the user script shop at the webring entrance.", 'lynx');
                    adv.say("I left the old browser to count up his earnings. It felt like it was taking forever to get into this store, but I was getting closer.");
                }
            }
        },
        synonyms: {
            'speak': 'talk',
            'pay': 'bribe'
        },
    });

    var insideBarFirst = true;
    adv.room('insideBar', function() {
        if (insideBarFirst) {
            insideBarFirst = false;
            adv.say("I stepped into the smoke-filled bar. It was stuffed with with cheap suits and cheaper morals, but a browser can't be picky about which parts of the internet he chooses to go to.");
            adv.say("I saw Mickey at a table in the corner. By some act of Berners-Lee, the rest of the bar got some sense into their heads and were leaving him alone.");
        } else {
            adv.say("I was in the bar. Mickey was still his little table, nursing a double of whatever liquid this bar called whiskey.");
        }

        adv.say("There wasn't much else to the bar. I could talk to Mickey, or leave.");
    }, {
        extraCommands: {
            talk: function() {
                if (mickeyDone) {
                    adv.say("I already got the info I needed from Mickey.");
                } else {
                    adv.setCurrentRoom('mickey');
                }
            },
            leave: function() {
                adv.setCurrentRoom('outsideBar');
            },
        },
        synonyms: {
            'speak': 'talk',
            'exit': 'leave'
        },
    });

    var mickeyFirst = true;
    var mickeyDone = false;
    adv.room('mickey', function() {
        if (mickeyFirst) {
            mickeyFirst = false;
            adv.say("I sat down opposite of Mickey. He looked up with the face of a man with no friends. I'd like to say that I was his friend, and that his face brightned up the moment he laid eyes on me, but you and I both know that'd be a hell of a lie.");
            adv.say("Oh, you.", 'mickey');
            adv.say("Yeah, me. How's it going, Mickey?", 'firefox');
            adv.say("Fine. Great. Tremendous. A guy like me couldn't be happier.", 'mickey');
            adv.say("What's got you down?", 'firefox');
            adv.say("Don't even pretend like you care. Whaddya want?", 'mickey');

            if (triedToEnterStore) {
                adv.say("I needed to ask Mickey about getting into that store.");
            } else {
                adv.say("I didn't have much to say to Mickey, so I figured I might as well leave.");
            }
        } else {
            adv.say("I sat back down in front of Mickey.");
            adv.say("You remember what you wanted? If not, leave me alone. I don't need you in my face right now.", 'mickey');
        }
    }, {
        extraCommands: {
            leave: function() {
                adv.say("You know what? I got somewhere to be right now. I'll catch you later, Mickey.", 'firefox');
                adv.say("Yeah, sure... jerk.", 'mickey');
                adv.say("I got up and left Mickey to his pity party.");
                adv.setCurrentRoom('insideBar');
            },
            ask: function(cmd) {
                if (!triedToEnterStore) {
                    adv.say("I didn't really have anything to ask him about at that point.");
                } else {
                    mickeyDone = true;
                    adv.score += 30;
                    adv.say("So, listen. I'm trying to get into that addon store...", 'firefox');
                    adv.say("And you keep getting kicked out because of your User-Agent, right? Yeah, you'll need an addon to spoof your User-Agent to get by. I saw one of those browsers outside going on about an addon he found that sounded like it would do the trick.", 'mickey');
                    adv.say("That's just what I was hoping to hear. Thanks for the help, Mickey.");
                    adv.say("I slipped a few Satoshis on the table for his trouble and left Mickey. Now I was getting somewhere.");
                    adv.setCurrentRoom('insideBar');
                }
            }
        },
        synonyms: {
            'exit': 'leave'
        },
    });

    adv.start();
})();
