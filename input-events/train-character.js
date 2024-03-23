'use strict';
const fs = require('fs');

const { Broadcast, Config, EventUtil, Logger } = require('ranvier');

/**
 * Account character selection event
 */
module.exports = {
    event: state => (socket, args) => {
        let account = args.account;
        const say = EventUtil.genSay(socket);
        const write = EventUtil.genWrite(socket);
        const pm = state.PlayerManager;


        // This just gets their names.
        const characters = account.characters.filter(currChar => currChar.deleted === false);

        let options = [];

        if (characters.length) {
            options.push({ display: "\r\n Which character do you want to train?" });
            characters.forEach(char => {
                options.push({
                    display: char.username,
                    onSelect: async () => {
                        // Load the player from the PlayerManager
                        let currentPlayer = await state.PlayerManager.loadPlayer(state, account, char.username);
                        socket.emit('train-character-skills', socket, { player: currentPlayer });

                    },
                });
            });
        }

        options.push({ display: "" });

        options.push({
            display: 'Quit',
            onSelect: () => socket.end(),
        });

        // Display options menu

        let optionI = 0;
        options.forEach((opt) => {
            if (opt.onSelect) {
                optionI++;
                say(`| <cyan>[${optionI}]</cyan> ${opt.display}`);
            } else {
                say(`| <bold>${opt.display}</bold>`);
            }
        });

        socket.write('|\r\n`-> ');

        socket.once('data', choice => {
            choice = choice.toString().trim();
            choice = parseInt(choice, 10) - 1;
            if (isNaN(choice)) {
                return socket.emit('train-character', socket, args);
            }

            const selection = options.filter(o => !!o.onSelect)[choice];

            if (selection) {
                Logger.log('Selected ' + selection.display);
                return selection.onSelect();
            }

            return socket.emit('train-character', socket, args);
        });
    }
};
