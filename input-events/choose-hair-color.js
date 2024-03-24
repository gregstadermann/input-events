'use strict';

const { EventUtil } = require('ranvier');

/**
 * Choose hair color player creation event.
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const write  = EventUtil.genWrite(socket);

        say('  Pick your hair color');
        say(' --------------------------');
        write('> ');
        const hairColors = [
            'amber',
            'auburn',
            'black',
            'blonde',
            'blue-black',
            'bright red',
            'brown',
            'brunette',
            'chestnut',
            'copper red',
            'dark blonde',
            'dark brown',
            'deep red',
            'ginger',
            'golden',
            'golden blonde',
            'golden brown',
            'grey',
            'grey-brown',
            'honey blonde',
            'jet black',
            'light brown',
            'platinum',
            'red',
            'russet',
            'sandy blonde',
            'silver',
            'silver blonde',
            'steel grey',
            'strawberry blonde',
            'titian',
            'white',
        ];
        for (const color of hairColors) {
            say(`[<bold>${color}</bold>] - <bold>${color}</bold>`);
        }

        socket.once('data', selectedHairColor => {
            selectedHairColor = selectedHairColor.toString().trim();
            selectedHairColor = hairColors.find((hairColor)=> {
                console.log('choice ', hairColor)
                return hairColor.includes(selectedHairColor) || hairColor.toLowerCase().includes(selectedHairColor);
            });
            if (!selectedHairColor) {
                return socket.emit('choose-hair-color', socket, args);
            }

            args.hairColor = selectedHairColor;
            socket.emit('choose-hair-style', socket, args);
        });

    }
};
