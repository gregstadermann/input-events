'use strict';

const { Config, Player } = require('ranvier');
const PlayerClass = require('../../classes/lib/PlayerClass');

/**
 * Finish player creation. Add the character to the account then add the player
 * to the game world
 */
module.exports = {
  event: state => {
    const startingRoomRef = Config.get('startingRoom');
    if (!startingRoomRef) {
      Logger.error('No starting room defined in gemstone.json');
    }

    return async (socket, args) => {
      let player = new Player({
        name: args.name,
        account: args.account,
      });


      // TIP:DefaultAttributes: This is where you can change the default attributes for players
      const defaultAttributes = {
        edged_weapons: 0,
        health: 100,
        strength: 20,
        agility: 20,
        intelligence: 20,
        energy: 100,
        stamina: 20,
        armor: 0,
        critical: 0,
        AS: 0,
        DS: 0
      };

      for (const attr in defaultAttributes) {
        player.addAttribute(state.AttributeFactory.create(attr, defaultAttributes[attr]));
      }

      args.account.addCharacter(args.name);
      args.account.save();

      player.setMeta('class', args.playerClass);

      const room = state.RoomManager.getRoom(startingRoomRef);
      player.room = room;
      await state.PlayerManager.save(player);

      // reload from manager so events are set
      player = await state.PlayerManager.loadPlayer(state, player.account, player.name);
      player.socket = socket;

      socket.emit('done', socket, { player });
    };
  }
};
