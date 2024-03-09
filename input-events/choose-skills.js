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
        args.skillCosts = args.skillCosts || currentClass.config.skills;
        let skillCosts = args.skillCosts;

        args.manaStat = currentClass.config.manaStat;
        args.skills = args.skills || [];
        args.mentalTPs = args.mentalTPs || 45;
        args.physicalTPs = args.physicalTPs || 45;
        args.skill = args.skill || '';

        //let currentClass = new PlayerClass(chosenPlayerClass, {}).getSkillList();
        //console.log('Args from choose-skills', args);
        //console.log(chosenPlayerClass, typeof(skillCosts), skillCosts);

        say('');
        say('  ' + chosenPlayerClass + ' Skill Training Costs');
        say(' --------------------------');
        let skills = Object.keys(skillCosts);

        for( let skill of Object.keys(skillCosts)){
            say(skillCosts[skill].name + ': ' + skillCosts[skill].cost + ' Ranks: '+ skillCosts[skill].ranks);
        }

        say('PTPs: '+ args.physicalTPs + ' | MTPs: ' + args.mentalTPs);
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
            let ptpToTrain;
            let mtpToTrain;
            args.skill = skill.toString().trim().toLowerCase();

            if(args.skill === 'done'){
                return socket.emit('finish-player', socket, args);
            }

            if(!skills.includes(args.skill)){
                say('That\'s not a valid skill');
                return socket.emit('choose-skills', socket, args);
            }

            if(args.skills.find(({ skill })=> args.skill === skill)){
                console.log(args.skill, skill);
                say('You already trained that skill, the cost has increased');
                ptpToTrain = skillCosts[args.skill].cost[0] * 2;
                mtpToTrain = skillCosts[args.skill].cost[1] * 2;
                if(args.skill.ranks > 3){
                    say('You can\'t train that skill any further');
                    return socket.emit('choose-skills', socket, args);
                }
            }else {
                ptpToTrain = skillCosts[args.skill].cost[0];
                mtpToTrain = skillCosts[args.skill].cost[1];
            }

            if(args.physicalTPs < ptpToTrain || args.mentalTPs < mtpToTrain){
                say('You don\'t have enough training points to train that skill');
                return socket.emit('choose-skills', socket, args);
            }

            args.physicalTPs -= ptpToTrain;
            args.mentalTPs -= mtpToTrain;

            if(args.skills.find(({ skill })=> args.skill === skill)) {
                console.log('Skill already exists in args.skills');
                args.skills.find(({skill}) => args.skill === skill).ranks++;
            }else{
                args.skills.push({skill: args.skill, ranks: 1});
            }

            console.log('physicalTPs ', args.physicalTPs, 'mentalTPs ', args.mentalTPs);
            console.log('args.skills', args.skills);

            return socket.emit('choose-skills', socket, args);
        });
    }
};
