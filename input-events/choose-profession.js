'use strict';

const { Broadcast, EventUtil } = require('ranvier');
const PlayerClass = require('../../classes/lib/PlayerClass');

/**
 * Choose profession player event
 * Followed by choose-rolls.js
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const write  = EventUtil.genWrite(socket);
        console.log('Args from choose-class', args);

        say('  Pick your class');
        say(' --------------------------');
        let classes = PlayerClass.getClasses();
        classes = Object.entries(classes).map(([id, instance]) => {
            return [id, instance.config];
        });
        for (const [ id, config ] of classes) {
            say(`[<bold>${id}</bold>] - <bold>${config.name}</bold> - Prime Stats: ${config.primeStats.join(', ')}`);
        }
        write('> ');

        socket.once('data', choice => {
            choice = choice.toString().trim();
            choice = classes.find(([id, config]) => {
                return id.includes(choice) || config.name.toLowerCase().includes(choice);
            });

            if (!choice) {
                return socket.emit('choose-profession', socket, args);
            }

            args.playerClass = choice[0];
            args.primeStats = choice[1].primeStats;
            socket.emit('choose-rolls', socket, args);
        });
    }
};
