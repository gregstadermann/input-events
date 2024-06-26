'use strict';
const fs = require('fs');

const { Broadcast, Config, EventUtil, Logger } = require('ranvier');

/**
 * Account character selection event
 */
module.exports = {
  event: state => (socket, args) => {
    let account = args.account;
    let maxCharacters = Config.get("maxCharacters");

    const say = EventUtil.genSay(socket);
    const write = EventUtil.genWrite(socket);
    const pm = state.PlayerManager;

    /*
    Player selection menu:
    * Can select existing player
    * Can create new (if less than 3 living chars)
    */
    const logo = fs.readFileSync(__dirname + '/../../../gs3logo').toString('utf8');
    if (logo) {
        say("\r\n");
        say(logo);
    }

    // This just gets their names.
    const characters = account.characters.filter(currChar => currChar.deleted === false);
    if(account.username === 'Zoso') { maxCharacters = 100;}
    const canAddCharacter = characters.length < maxCharacters;

    let options = [];

    // Configure account options menu
    options.push({
      display: 'Change Password',
      onSelect: () => {
        socket.emit('change-password', socket, { account, nextStage: 'choose-character' });
      },
    });

    if (canAddCharacter) {
      options.push({
        display: 'Create New Character',
        onSelect: () => {
          socket.emit('create-player', socket, { account });
        },
      });
    }

    if (characters.length) {
      options.push({ display: "\r\n Login As:" });
      characters.forEach(char => {
        options.push({
          display: char.username,
          onSelect: async () => {
            // Load the player from the PlayerManager
            let currentPlayer = pm.getPlayer(char.username);
            let existed = false;
            if (currentPlayer) {
              // kill old connection
              Broadcast.at(currentPlayer, 'Connection taken over by another client. Goodbye.');
              currentPlayer.socket.end();

              // link new socket
              currentPlayer.socket = socket;
              Broadcast.at(currentPlayer, 'Taking over old connection. Welcome.');
              Broadcast.prompt(currentPlayer);

              currentPlayer.socket.emit('commands', currentPlayer);
              return;
            }

            currentPlayer = await state.PlayerManager.loadPlayer(state, account, char.username);
            currentPlayer.socket = socket;
            socket.emit('done', socket, { player: currentPlayer });

          },
        });
      });
    }

    options.push({ display: "" });

    if (characters.length) {
      options.push({
        display: 'Delete a Character',
        onSelect: () => {
          socket.emit('delete-character', socket, args);
        },
      });
    }

    options.push({
      display: 'Delete This Account',
      onSelect: () => {
        say('<bold>By deleting this account, all the characters will be also deleted.</bold>');
        write(`<bold>Are you sure you want to delete this account? </bold> <cyan>[Y/n]</cyan> `);
          socket.once('data', confirmation => {
            say('');
            confirmation = confirmation.toString().trim().toLowerCase();

            if (!/[yn]/.test(confirmation)) {
              say('<b>Invalid Option</b>');
              return socket.emit('choose-character', socket, args);
            }

            if (confirmation === 'n') {
              say('No one was deleted...');
              return socket.emit('choose-character', socket, args);
            }

            say(`Deleting account <b>${account.username}</b>`);
            account.deleteAccount();
            say('Account deleted, it was a pleasure doing business with you.');
            socket.end();
          });
      },
    });

    options.push({
      display: "Train a Character",
      onSelect: () => {
        socket.emit('train-character', socket, args);
      },
    });

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
        return socket.emit('choose-character', socket, args);
      }

      const selection = options.filter(o => !!o.onSelect)[choice];

      if (selection) {
        Logger.log('Selected ' + selection.display);
        return selection.onSelect();
      }

      return socket.emit('choose-character', socket, args);
    });
  }
};
