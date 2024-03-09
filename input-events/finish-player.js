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
          skills: args.skills,
          manaStat: args.manaStat,
      });
        console.log('args from finish-player', args);
        let skillMap = new Map(args.skills.map(obj => [obj.skill, obj.ranks]));
        let manaStat = args.stats.get(args.manaStat);
        // TIP:DefaultAttributes: This is where you can change the default attributes for players
        // Skills are in number of ranks
        // All I need to do is get skills out of args.skills into this object which is written to the player
        const defaultAttributes = {
            brawling: skillMap.get('brawling') || 0,
            one_handed_edged: skillMap.get('one_handed_edged') || 0,
            one_handed_blunt: skillMap.get('one_handed_blunt') || 0,
            two_handed: skillMap.get('two_handed') || 0,
            polearm: skillMap.get('polearm') || 0,
            ranged: skillMap.get('ranged') || 0,
            thrown: skillMap.get('thrown') || 0,
            combat_maneuvers: skillMap.get('combat_maneuvers') || 0,
            shield_use: skillMap.get('shield_use') || 0,
            armor_use: skillMap.get('armor_use') || 0,
            climbing: skillMap.get('climbing') || 0,
            swimming: skillMap.get('swimming') || 0,
            disarm_traps: skillMap.get('disarm_traps') || 0,
            pick_locks: skillMap.get('pick_locks') || 0,
            stalk_and_hide: skillMap.get('stalk_and_hide') || 0,
            perception: skillMap.get('perception') || 0,
            ambush: skillMap.get('ambush') || 0,
            spell_aim: skillMap.get('spell_aim') || 0,
            physical_training: skillMap.get('physical_training') || 0,
            mana_share: skillMap.get('mana_share') || 0,
            magic_item_use: skillMap.get('magic_item_use') || 0,
            scroll_reading: skillMap.get('scroll_reading') || 0,
            first_aid: skillMap.get('first_aid') || 0,
            harness_power: skillMap.get('harness_power') || 0,
            major_elemental: skillMap.get('major_elemental') || 0,
            minor_elemental: skillMap.get('minor_elemental') || 0,
            wizard_base: skillMap.get('wizard_base') || 0,

            mana: Math.round(manaStat/2),
            health: Math.round((args.stats.get('constitution') + args.stats.get('strength')) / 10),

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
