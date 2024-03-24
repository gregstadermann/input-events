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
        const details = [
            'none',
            'aquiline',
            'beak-like',
            'broad',
            'broken',
            'bulbous',
            'button',
            'classical',
            'crooked',
            'flaring',
            'flat',
            'freckled',
            'hooked',
            'large',
            'long',
            'pinched',
            'pointed',
            'prominent',
            'red',
            'sloping',
            'small',
            'straight',
            'thin',
            'upturned',
            'wart-tipped'
        ];
        for (const detail of details) {
            say(`[<bold>${detail}</bold>]`);
        }

        socket.once('data', selectedDetail => {
            selectedDetail = selectedDetail.toString().trim();
            selectedDetail = details.find((detail)=> {
                return detail.includes(selectedDetail) || detail.toLowerCase().includes(selectedDetail);
            });
            if (!selectedDetail) {
                return socket.emit('choose-nose-details', socket, args);
            }

            args.noseDetail = selectedDetail;
            socket.emit('choose-face-features', socket, args);
        });

    }
};
