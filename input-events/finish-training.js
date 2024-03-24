'use strict';

module.exports = {
    event: state => {

        return async (socket, args) => {
            let currentPlayer;
            let pm = state.PlayerManager;
            let skillMap = new Map(args.skills.map(obj => [obj.skill, obj.ranks]));

            currentPlayer = await state.PlayerManager.loadPlayer(state, args.player.account, args.player.name);
            for (let trainedSkill of skillMap.entries()){
                currentPlayer.attributes[trainedSkill[0]].base += trainedSkill[1];
            }
            currentPlayer.tps = args.tps;
            currentPlayer.socket = socket;
            socket.emit('done', socket, { player: currentPlayer });
        };
    }
};
