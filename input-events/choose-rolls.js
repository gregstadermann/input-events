'use strict';

const { Random } = require('rando-js');
const { EventUtil } = require('ranvier');

/**
 * Roll For Stats
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const write = EventUtil.genWrite(socket);
        let rollSet = new Set();

        function rollStat(subsetType) {
            if (subsetType === '50_90') {
                let roll1 = Random.inRange(50, 90);
                let roll2 = Random.inRange(50, 90);
                let roll3 = Random.inRange(50, 90);
                rollSet.add(roll1);
                rollSet.add(roll2);
                rollSet.add(roll3);
            } else if (subsetType === '40_60') {
                let roll1 = Random.inRange(40, 60);
                let roll2 = Random.inRange(40, 60);
                let roll3 = Random.inRange(40, 60);
                rollSet.add(roll1);
                rollSet.add(roll2);
                rollSet.add(roll3);
            } else if (subsetType === '20_50') {
                let roll1 = Random.inRange(20, 50);
                let roll2 = Random.inRange(20, 50);
                let roll3 = Random.inRange(20, 50);
                rollSet.add(roll1);
                rollSet.add(roll2);
                rollSet.add(roll3);

            } else if (subsetType === '20_100') {
                let roll = Random.inRange(20, 100);
                rollSet.add(roll);
            }

        }
        rollStat('50_90');
        rollStat('40_60');
        rollStat('20_50');
        rollStat('20_100');
        console.log(rollSet);

        function assignStats() {
            let stats = Array.from(rollSet);
            stats = stats.sort((a, b) => a - b);
            return stats;
        }
        /* Roll and assign stats */
        say('You toss the dice of fate, watching them tumble and come to rest...');
        for (const result of rollSet) {
            say(`[<bold>${result}</bold>]`);
        }
        say('Accept this set of rolls? Y/N?');
        socket.once('data', confirmation => {
            say('');
            confirmation = confirmation.toString().trim().toLowerCase();

            if (!/[yn]/.test(confirmation)) {
                args.rolls = rollSet;
                return socket.emit('choose-stats', socket, args);
            }

            if (confirmation === 'n') {
                say(`Let's try again...`);
                return socket.emit('choose-rolls', socket, args);
            }
        });
    }
};
