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
        const colors = [
            'ale-brown',
            'amber',
            'black',
            'blue',
            'blue-green',
            'blue-grey',
            'brown',
            'chestnut',
            'clear colored',
            'crystal blue',
            'crystal green',
            'dark',
            'golden',
            'green',
            'grey',
            'grey-green',
            'hazel',
            'jade green',
            'milky blue',
            'milky white',
            'pale grey',
            'pink albino',
            'sea green',
            'silver',
            'steel grey',
            'stormy grey',
            'violet',
            'pale blue'
        ];
        for (const color of colors) {
            say(`[<bold>${color}</bold>] - <bold>${color}</bold>`);
        }

        socket.once('data', selectedColor => {
            selectedColor = selectedColor.toString().trim();
            selectedColor = colors.find((color)=> {
                console.log('choice ', color)
                return color.includes(selectedColor) || color.toLowerCase().includes(selectedColor);
            });
            if (!selectedColor) {
                return socket.emit('choose-eye-color', socket, args);
            }

            args.eyeColor = selectedColor;
            socket.emit('choose-eye-traits', socket, args);
        });

    }
};
