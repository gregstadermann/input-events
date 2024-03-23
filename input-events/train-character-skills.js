'use strict';
const fs = require('fs');

const { Broadcast, Config, EventUtil, Logger } = require('ranvier');
const PlayerClass = require("../../classes/lib/PlayerClass");

/**
 * Account character selection event
 */
module.exports = {
    event: state => (socket, args) => {
        //console.log('Args: ', args);
        const say = EventUtil.genSay(socket);
        let ptp = args.player.tps[0];
        let mtp = args.player.tps[1];
        args.ptp = args.ptp || ptp;
        args.mtp = args.mtp || mtp;

        const chosenPlayerClass = args.player.metadata.class;
        let currentClass = PlayerClass.get(chosenPlayerClass);
        let skillCosts = currentClass.config.skills;
        args.skill = args.skill || '';
        args.skills = args.skills || [];
        //console.log('Skill Costs: ', skillCosts);
        //console.log('TPs: ', tps);

        say('Choose a skill to train (case insensitive) or type "done" to finish: ');
        say('');
        say('  ' + chosenPlayerClass + ' Skill Training Costs');
        say(' --------------------------');

        let skills = Object.keys(skillCosts);
        //console.log('Skills: ', skills);

        for( let skill of Object.keys(skillCosts)){
            say(skillCosts[skill].name + ': ' + skillCosts[skill].cost + ' Ranks: '+ skillCosts[skill].ranks);
        }

        say(' --------------------------');
        say('PTPs: '+ args.ptp + ' | MTPs: ' + args.mtp);

        socket.once('data', skill => {
            let ptpToTrain;
            let mtpToTrain;
            args.skill = skill.toString().trim().toLowerCase();

            if(args.skill === 'done'){
                args.tps = [args.ptp, args.mtp];
                return socket.emit('finish-training', socket, args);
            }

            if(!skills.includes(args.skill)){
                say('That\'s not a valid skill');
                return socket.emit('train-character-skills', socket, args);
            }

            if(args.skills.find(({ skill })=> args.skill === skill)){
                say('You already trained that skill, the cost has increased');
                ptpToTrain = skillCosts[args.skill].cost[0] * 2;
                mtpToTrain = skillCosts[args.skill].cost[1] * 2;
                if(args.skill.ranks > 3){
                    say('You can\'t train that skill any further');
                    return socket.emit('train-character-skills', socket, args);
                }
            }else {
                ptpToTrain = skillCosts[args.skill].cost[0];
                mtpToTrain = skillCosts[args.skill].cost[1];
                console.log('PTP to train: ', ptpToTrain);
                console.log('MTP to train: ', mtpToTrain);
                console.log('PTP: ', ptp);
                console.log('MTP: ', mtp);
            }

            if(ptp < ptpToTrain || mtp < mtpToTrain){
                say('You don\'t have enough training points to train that skill');
                return socket.emit('train-character-skills', socket, args);
            }

            args.ptp -= ptpToTrain;
            args.mtp -= mtpToTrain;
console.log('After subtraction from training PTP: ', args.ptp);
console.log('After subtraction from training MTP: ', args.mtp);
            if(args.skills.find(({ skill })=> args.skill === skill)) {
                args.skills.find(({skill}) => args.skill === skill).ranks++;
            }else{
                args.skills.push({skill: args.skill, ranks: 1});
            }

            return socket.emit('train-character-skills', socket, args);
        });

    }
};

