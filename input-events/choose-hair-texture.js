'use strict';

const { EventUtil } = require('ranvier');

/**
 * Choose hair texture player creation event.
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const write  = EventUtil.genWrite(socket);

        say('  Pick your hair texture');
        say(' --------------------------');
        write('> ');
        const textures = [
            'none',
            'braided',
            'curly',
            'fine',
            'flowing',
            'frizzy',
            'glossy',
            'greasy',
            'lank',
            'limp',
            'loose',
            'matted',
            'peppered',
            'shaggy',
            'shiny',
            'silky',
            'straight',
            'stringy',
            'tangled',
            'thick',
            'tied back',
            'tousled',
            'unkempt',
            'unruly',
            'wavy'
        ];
        for (const texture of textures) {
            say(`[<bold>${texture}</bold>] - <bold>${texture}</bold>`);
        }

        socket.once('data', selectedTexture => {
            selectedTexture = selectedTexture.toString().trim();
            selectedTexture = textures.find((texture)=> {
                console.log('choice ', texture)
                return texture.includes(selectedTexture) || texture.toLowerCase().includes(selectedTexture);
            });
            if (!selectedTexture) {
                return socket.emit('choose-hair-texture', socket, args);
            }

            args.hairTexture = selectedTexture;
            socket.emit('choose-hair-quirks', socket, args);
        });

    }
};
