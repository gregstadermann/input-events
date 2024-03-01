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
      // Skills are in number of ranks
      const defaultAttributes = {
        brawling: 0,
        one_handed_edged: 0,
        one_handed_blunt: 0,
        two_handed: 0,
        polearm: 0,
        ranged: 0,
        thrown: 0,
        combat_maneuvers: 0,
        shield_use: 0,
        armor_use: 0,
        climbing: 0,
        swimming: 0,
        disarm_traps: 0,
        pick_locks: 0,
        stalk_and_hide: 0,
        perception: 0,
        ambush: 0,
        spell_aim: 0,
        physical_training: 0,
        mana_share: 0,
        magic_item_use: 0,
        scroll_reading: 0,
        first_aid: 0,

        mana: 0,
        health: 10,

        discipline: 0,
        aura: 0,
        strength: 0,
        logic: 0,
        charisma: 0,
        wisdom: 0,
        intelligence: 0,
        dexterity: 0,
        constitution: 0,
        reflexes: 0,
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
