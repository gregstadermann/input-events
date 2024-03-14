'use strict';

const { EventUtil } = require('ranvier');
const PlayerClass = require('../../classes/lib/PlayerClass');

/**
 * Choose Skills player creation event.
 * Followed by finish-player.js
 */
module.exports = {
    event: state => (socket, args) => {
        const say = EventUtil.genSay(socket);
        const chosenPlayerClass = args.playerClass;
        let currentClass = PlayerClass.get(chosenPlayerClass);

        args.skillCosts = args.skillCosts || currentClass.config.skills;
        console.log('args.skilLCosts', args.skillCosts);
        let skillCosts = args.skillCosts;
console.log('skillCosts', skillCosts);
        args.manaStat = currentClass.config.manaStat;
        args.skills = args.skills || [];
        args.mentalTPs = args.mentalTPs || 45;
        args.physicalTPs = args.physicalTPs || 45;
        args.skill = args.skill || '';

        say('Choose a skill to train (case insensitive) or type "done" to finish: ');
        say('');
        say('  ' + chosenPlayerClass + ' Skill Training Costs');
        say(' --------------------------');

        let skills = Object.keys(skillCosts);
        console.log('skills', skills);

        for( let skill of Object.keys(skillCosts)){
            say(skillCosts[skill].name + ': ' + skillCosts[skill].cost + ' Ranks: '+ args.skills[skill].ranks);
        }

        say(' --------------------------');
        say('PTPs: '+ args.physicalTPs + ' | MTPs: ' + args.mentalTPs);

        socket.once('data', skill => {
            let ptpToTrain;
            let mtpToTrain;
            args.skill = skill.toString().trim().toLowerCase();

            if(args.skill === 'done'){
                args.tps = [args.physicalTPs, args.mentalTPs];
                return socket.emit('finish-player', socket, args);
            }

            if(!skills.includes(args.skill)){
                say('That\'s not a valid skill');
                return socket.emit('choose-skills', socket, args);
            }

            if(args.skills.find(({ skill })=> args.skill === skill)){
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
                args.skills.find(({skill}) => args.skill === skill).ranks++;
            }else{
                args.skills.push({skill: args.skill, ranks: 1});
            }

            return socket.emit('choose-skills', socket, args);
        });
    }
};
