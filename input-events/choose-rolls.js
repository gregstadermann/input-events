'use strict';

const { Random } = require('rando-js');
const { EventUtil } = require('ranvier');

/**
 * Roll for stats player creation event.
 * Followed by choose-stats.js
 */
module.exports = {
    event: state => (socket, args) => {
        args.rolls = args.rolls || [];
        const say = EventUtil.genSay(socket);
        const write = EventUtil.genWrite(socket);
        let rolls = args.rolls;

        function rollStat(subsetType) {
            if (subsetType === '50_90') {
                let roll1 = Random.inRange(50, 90);
                let roll2 = Random.inRange(50, 90);
                let roll3 = Random.inRange(50, 90);
                rolls.push(roll1);
                rolls.push(roll2);
                rolls.push(roll3);
            } else if (subsetType === '40_60') {
                let roll1 = Random.inRange(40, 60);
                let roll2 = Random.inRange(40, 60);
                let roll3 = Random.inRange(40, 60);
                rolls.push(roll1);
                rolls.push(roll2);
                rolls.push(roll3);
            } else if (subsetType === '20_50') {
                let roll1 = Random.inRange(20, 50);
                let roll2 = Random.inRange(20, 50);
                let roll3 = Random.inRange(20, 50);
                rolls.push(roll1);
                rolls.push(roll2);
                rolls.push(roll3);

            } else if (subsetType === '20_100') {
                let roll = Random.inRange(20, 100);
                rolls.push(roll);
            }

        }
        rollStat('50_90');
        rollStat('40_60');
        rollStat('20_50');
        rollStat('20_100');

        /* Roll and assign stats */
        say('You toss the dice of fate, watching them tumble and come to rest...');
        let total = 0;
        for (const result of rolls) {
            say(`[<bold>${result}</bold>]`);
            total += result;
        }
        say(`Total: <bold>${total}</bold>`);
        say('Accept this set of rolls? Y/N?');
        socket.once('data', confirmation => {
            say('');
            confirmation = confirmation.toString().trim().toLowerCase();

            if (!/[yn]/.test(confirmation)) {
                args.initialRolls = rolls;
                return socket.emit('choose-stats', socket, args);
            }

            if (confirmation === 'n') {
                rolls.length = 0;
                say(`Let's try again...`);
                return socket.emit('choose-rolls', socket, args);
            }
            return socket.emit('choose-stats', socket, args);
        });
    }
};
