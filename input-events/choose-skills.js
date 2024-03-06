'use strict';

const { EventUtil } = require('ranvier');
const PlayerClass = require('../../classes/lib/PlayerClass');

/**
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const chosenPlayerClass = args.playerClass;
        let currentClass = PlayerClass.get(chosenPlayerClass);
        let skillCosts = currentClass.config.skills;
        //let currentClass = new PlayerClass(chosenPlayerClass, {}).getSkillList();
        console.log('Args from choose-skills', args);
        console.log(chosenPlayerClass, typeof(skillCosts), skillCosts);

        say('');
        say('  ' + chosenPlayerClass + ' Skill Training Costs');
        say(' --------------------------');
        let skills = Object.keys(skillCosts);

        for( let skill of Object.keys(skillCosts)){
            say(skillCosts[skill].name + ': ' + skillCosts[skill].cost);
        }
        /** for (let stat of args.stats.keys()){
            say(`${stat}: ${args.stats.get(stat)}`);
        }
        say('');
        say('You have ' + rolls.size + ' rolls left to assign:');
        say(args.rolls.toString());
        say('');
        say('Enter a stat to assign a roll to, or type "done" to finish: ');
         **/

        /**
         * The selected code is a callback function that is triggered once when the 'data' event is emitted on the i
         * 'socket' object. This event is typically emitted when data is received from the client. The data received is
         * expected to be the name of a skill that the player wants to train.
         **/

        socket.once('data', skill => {
            say('Choose a skill to train (case insensitive) or type "done" to finish: ');
            skill = skill.toString().trim().toLowerCase();

            if(!skills.includes(skill)){
                say('That\'s not a valid skill');
                return socket.emit('choose-skills', socket, args);
            }

            skills.push(skill);
            console.log('Skills', skills);

            if(skills.length < 3){
                return socket.emit('choose-skills', socket, args);
            }

            socket.emit('final-confirmation', socket, args);
        });
    }
};
