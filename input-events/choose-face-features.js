'use strict';

const { EventUtil } = require('ranvier');

/**
 * Choose nose description player creation event.
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const write  = EventUtil.genWrite(socket);

        say('  Pick your skin tone');
        say(' --------------------------');
        write('> ');
        const features = [
            'none',
            'angular',
            'bony',
            'broad',
            'clean-shaven',
            'delicate',
            'flat',
            'fleshy',
            'gaunt',
            'haggard',
            'long',
            'narrow',
            'oval',
            'pinched',
            'plump',
            'pock-marked',
            'round',
            'square',
            'square-jawed',
            'triangular',
            'unshaven',
            'weathered',
            'wrinkled'
        ];
        for (const feature of features) {
            say(`[<bold>${feature}</bold>]`);
        }

        socket.once('data', selectedFeature => {
            selectedFeature = selectedFeature.toString().trim();
            selectedFeature = features.find((feature)=> {
                return feature.includes(selectedFeature) || feature.toLowerCase().includes(selectedFeature);
            });
            if (!selectedFeature) {
                return socket.emit('choose-face-features', socket, args);
            }

            args.faceFeature = selectedFeature;
            socket.emit('choose-distinguishing-marks', socket, args);
        });

    }
};
