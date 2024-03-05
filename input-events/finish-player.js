'use strict';

const { Config, Player } = require('ranvier');

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
        rolls: args.rolls,
        stats: args.stats,
          sex: args.sex,
      });
//console.log(typeof(rolls), rolls);
console.log('args from finish-player', args);
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
        // need to be able to do: discipline: args.stats.discipline
        discipline: args.stats.get('discipline'),
        aura: args.stats.get('aura'),
        strength: args.stats.get('strength'),
        logic: args.stats.get('logic'),
        charisma: args.stats.get('charisma'),
        wisdom: args.stats.get('wisdom'),
        intelligence: args.stats.get('intelligence'),
        dexterity: args.stats.get('dexterity'),
        constitution: args.stats.get('constitution'),
        reflexes: args.stats.get('reflexes'),
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
      player.sex = args.sex;
      // reload from manager so events are set
      player = await state.PlayerManager.loadPlayer(state, player.account, player.name);
      player.socket = socket;

      socket.emit('done', socket, { player });
    };
  }
};
