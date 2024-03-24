'use strict';

const { EventUtil } = require('ranvier');

/**
 * Choose hair color player creation event.
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const write  = EventUtil.genWrite(socket);

        say('  Pick your height');
        say(' --------------------------');
        write('> ');
        const heights = [
            'short',
            'shorter than average',
            'average height',
            'taller than average',
            'tall',
            'very tall'
        ];
        for (const height of heights) {
            say(`[<bold>${height}</bold>] - <bold>${height}</bold>`);
        }

        socket.once('data', selectedHeight => {
            selectedHeight = selectedHeight.toString().trim();
            selectedHeight = heights.find((height)=> {
                console.log('choice ', height)
                return height.includes(selectedHeight) || height.toLowerCase().includes(selectedHeight);
            });
            if (!selectedHeight) {
                return socket.emit('choose-height', socket, args);
            }

            args.height = selectedHeight;
            socket.emit('choose-hair-color', socket, args);
        });

    }
};
