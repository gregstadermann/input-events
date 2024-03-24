'use strict';

const { EventUtil } = require('ranvier');

/**
 * Choose hair texture player creation event.
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const write  = EventUtil.genWrite(socket);

        say('  Pick your hair quirks');
        say(' --------------------------');
        write('> ');
        const quirks = [
            'none',
            'shaved at the temples',
            'streaked with silver',
            'swept back from the temples',
            'with a black streak running through it',
            'with a large bald spot',
            'with a red streak running through it',
            'with a white streak running through it',
            'with grey at the temples',
            'with lighter streaks',
            'worn in a ponytail',
            'worn in a single braid',
            'worn in elaborate braids',
            'worn in two ponytails'
        ];
        for (const quirk of quirks) {
            say(`[<bold>${quirk}</bold>] - <bold>${quirk}</bold>`);
        }

        socket.once('data', selectedQuirk => {
            selectedQuirk = selectedQuirk.toString().trim();
            selectedQuirk = quirks.find((quirk)=> {
                console.log('choice ', quirk)
                return quirk.includes(selectedQuirk) || quirk.toLowerCase().includes(selectedQuirk);
            });
            if (!selectedQuirk) {
                return socket.emit('choose-hair-quirks', socket, args);
            }

            args.hairQuirk = selectedQuirk;
            socket.emit('choose-eye-color', socket, args);
        });

    }
};
