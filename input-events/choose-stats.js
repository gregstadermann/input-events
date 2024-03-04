'use strict';

const { EventUtil } = require('ranvier');

/**
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        let allRolls = new Map(Object.entries(args.rolls));
        let rolls;
        if(rolls === undefined){
            rolls = allRolls;
        }

        args.stats = args.stats || new Map([
            ['discipline', 0],
            ['aura', 0],
            ['strength', 0],
            ['logic', 0],
            ['charisma', 0],
            ['wisdom', 0],
            ['intelligence', 0],
            ['dexterity', 0],
            ['constitution', 0],
            ['reflexes', 0]
        ]);

        say('ASSIGN YOUR STAT SCORES');
        say('Rolls left to assign to stats: ' + args.rolls.toString());
        say('Your character\'s stats so far:');
        for (let stat of args.stats.keys()){
            say(`${stat}: ${args.stats.get(stat)}`);
        }
        say('Enter a stat to assign a roll to, or type "done" to finish: ');

        socket.once('data', stat => {
            say('');
            stat = stat.toString().trim().toLowerCase();

            if(args.stats.has(stat)){
                say('Enter a roll to assign to ' + stat + ': ');
                socket.once('data', selectedRoll => {
                    say('');
                    selectedRoll= Number(selectedRoll.toString().trim().toLowerCase());
                    args.stats.set(stat, selectedRoll);
                    let index = args.rolls.indexOf(selectedRoll);
                    if (index !== -1) {
                        console.log(args);
                        args.rolls.splice(index, 1);
                    }
                    if(rolls.size > 0){
                        console.log(args);
                        return socket.emit('choose-stats', socket, args);
                    }
                    else{
                        return socket.emit('choose-class', socket, args);
                    }
                });
            }
            else if(stat === 'done'){
                if(rolls > 0){
                    say('You have rolls left to assign');
                    return socket.emit('choose-stats', socket, args);
                }
                else{
                    return socket.emit('finish-player', socket, args);
                }
            }
            else{
                say('That\'s not a valid stat');
                return socket.emit('choose-stats', socket, args);
            }
        });
    }
};
