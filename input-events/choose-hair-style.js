'use strict';

const { EventUtil } = require('ranvier');

/**
 * Choose hair color player creation event.
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const write  = EventUtil.genWrite(socket);

        say('  Pick your hair style');
        say(' --------------------------');
        write('> ');
        const styles = [
            'bald',
            'balding',
            'chin length',
            'cropped',
            'long',
            'raggedly cut',
            'receding',
            'shaven head',
            'short',
            'shoulder length',
            'thinning',
            'tonsured',
            'very long',
            'very short',
            'waist length'
        ];
        for (const style of styles) {
            say(`[<bold>${style}</bold>] - <bold>${style}</bold>`);
        }

        socket.once('data', selectedStyle => {
            selectedStyle = selectedStyle.toString().trim();
            selectedStyle = styles.find((style)=> {
                console.log('choice ', style)
                return style.includes(selectedStyle) || style.toLowerCase().includes(selectedStyle);
            });
            if (!selectedStyle) {
                return socket.emit('choose-hair-style', socket, args);
            }

            args.hairStyle = selectedStyle;
            socket.emit('choose-hair-texture', socket, args);
        });

    }
};
