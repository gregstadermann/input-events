'use strict';

const { EventUtil } = require('ranvier');

/**
 * Choose nose description player creation event.
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const write  = EventUtil.genWrite(socket);

        say('  Pick your distinguishing mark ');
        say(' --------------------------');
        write('> ');
        const marks = [
            'none',
            'birth mark',
            'broad chest',
            'broad shoulders',
            'bulging forehead',
            'bushy eyebrows',
            'bushy sideburns',
            'cleft chin',
            'curled mustache',
            'dimpled cheeks',
            'double chin',
            'drooping mustache',
            'frown lines',
            'generous mouth',
            'heavy jowls',
            'high cheekbones',
            'high forehead',
            'deep laugh lines',
            'long beard',
            'low forehead',
            'missing tooth',
            'neatly-trimmed beard',
            'pointed chin',
            'pronounced jawline',
            'pronounced overbite',
            'protruding ears',
            'receding chin',
            'shaggy mustache',
            'short beard',
            'small goatee',
            'small mustache',
            'stooped shoulders',
            'sunken cheeks',
            'tangled beard',
            'thick bushy eyebrows',
            'thick mustache and beard',
            'thick neck',
            'thin eyebrows',
            'thin lips'
        ];
        for (const mark of marks) {
            say(`[<bold>${mark}</bold>]`);
        }

        socket.once('data', selectedMark => {
            selectedMark = selectedMark.toString().trim();
            selectedMark = marks.find((mark)=> {
                return mark.includes(selectedMark) || mark.toLowerCase().includes(selectedMark);
            });
            if (!selectedMark) {
                return socket.emit('choose-distinguishing-marks', socket, args);
            }

            args.distinguishingMark = selectedMark;
            socket.emit('choose-profession', socket, args);
        });

    }
};
