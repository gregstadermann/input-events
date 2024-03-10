'use strict';

const { EventUtil } = require('ranvier');
const PlayerRace = require('../lib/PlayerRace');

/**
 * Choose race player creation event.
 * Followed by choose-profession.js
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const write  = EventUtil.genWrite(socket);
        console.log('Args from choose-race', args);

        say('  Pick your race');
        say(' --------------------------');
        let races = PlayerRace.getRaces();
        console.log(races);
        races = Object.entries(races).map(([id, instance]) => {
            console.log(races);
            return [id, instance.name]
        });
        for (const [ id] of races) {
            console.log(races);
            say(`[<bold>${id}</bold>] - <bold>${id.description}</bold>`);
        }
        write('> ');

        socket.once('data', choice => {
            choice = choice.toString().trim();
            choice = races.find(([id]) => {
                return id.includes(choice) || id.toLowerCase().includes(choice);
            });

            if (!choice) {
                return socket.emit('choose-race', socket, args);
            }

            args.playerRace = choice[0];
            socket.emit('choose-profession', socket, args);
        });

    }
};
