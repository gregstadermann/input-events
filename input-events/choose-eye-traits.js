'use strict';

const { EventUtil } = require('ranvier');

/**
 * Choose eye color player creation event.
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const write  = EventUtil.genWrite(socket);

        say('  Pick your eye color');
        say(' --------------------------');
        write('> ');
        const traits = [
            'none',
            'almond-shaped',
            'beady',
            'bleary',
            'bloodshot',
            'bright',
            'brooding',
            'bulging',
            'close-set',
            'clouded',
            'crossed',
            'dark-rimmed',
            'deep-set',
            'gold-flecked',
            'heavy-lidded',
            'hooded',
            'large',
            'long-lashed',
            'piercing',
            'red-rimmed',
            'silver-flecked',
            'sleepy',
            'small',
            'sparkling',
            'thick-lashed',
            'tilted',
            'tired',
            'twitching',
            'uneven',
            'watery',
            'wide-set',
        ];
        for (const trait of traits) {
            say(`[<bold>${trait}</bold>] - <bold>${trait}</bold>`);
        }

        socket.once('data', selectedTrait => {
            selectedTrait = selectedTrait.toString().trim();
            selectedTrait = traits.find((trait)=> {
                return trait.includes(selectedTrait) || trait.toLowerCase().includes(selectedTrait);
            });
            if (!selectedTrait) {
                return socket.emit('choose-eye-traits', socket, args);
            }

            args.eyeTrait = selectedTrait;
            socket.emit('choose-nose-details', socket, args);
        });

    }
};
