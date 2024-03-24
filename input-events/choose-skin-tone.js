'use strict';

const { EventUtil } = require('ranvier');

/**
 * Choose skin tone player creation event.
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const write  = EventUtil.genWrite(socket);

        say('  Pick your skin tone');
        say(' --------------------------');
        write('> ');
        const tones = [
            'alabaster',
            'ashen',
            'black',
            'blotchy',
            'bronze',
            'brown',
            'copper',
            'dark',
            'dark brown',
            'dusky',
            'ebon',
            'fair',
            'freckled',
            'golden brown',
            'ivory',
            'lily white',
            'milky white',
            'nut brown',
            'olive',
            'pale',
            'pasty white',
            'rosy',
            'ruddy',
            'sallow',
            'tanned'
        ];
        for (const tone of tones) {
            say(`[<bold>${tone}</bold>]`);
        }

        socket.once('data', selectedTone => {
            selectedTone = selectedTone.toString().trim();
            selectedTone = tones.find((tone)=> {
                return tone.includes(selectedTone) || tone.toLowerCase().includes(selectedTone);
            });
            if (!selectedTone) {
                return socket.emit('choose-skin-tone', socket, args);
            }

            args.skinTone = selectedTone;
            socket.emit('choose-height', socket, args);
        });

    }
};
