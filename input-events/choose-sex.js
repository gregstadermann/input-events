'use strict';

const { EventUtil } = require('ranvier');

/**
 * CHoose a gender
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const write  = EventUtil.genWrite(socket);

        write(`<bold>Please choose your gender (M/F):</bold>`);
        socket.once('data', confirmation => {
            say('');
            confirmation = confirmation.toString().trim().toLowerCase();

            if (!/[mf]/.test(confirmation)) {
                return socket.emit('choose-sex', socket, args);
            }

            if (confirmation === 'f') {
                args.sex = 'female';
                return socket.emit('choose-race', socket, args);
            }

            if(confirmation === 'm'){
                args.sex = 'male';
                return socket.emit('choose-race', socket, args);
            }

            socket.emit('choose-race', socket, args);
        });
    }
};
