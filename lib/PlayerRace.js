'use strict';

let races = null;

/**
 * Base player class
 */
class PlayerRace {
    constructor(id, config) {
        this.id = id;
        this.config = config;
    }
    static getRace(id) {
        console.log('PlayerRace.getRaces() is ', this.getRaces());
        console.log('PlayerRace.getRace() called with id ', id);
        return this.getRaces()[id];
    }
    static getRaces() {
        if (races) {
            return races;
        }

        races = {
            human: {
                name: 'Human',
                description: 'Humans are the most common',
                statBonusModifiers: {
                    strength: 5,
                    logic: 5,
                    charisma: 5
                },
                baseHp: 150,
                baseWeight: 90,
            },
            elf: {
                name: 'Elf',
                description: 'Elves are the most magical',
                statBonusModifiers: {
                    dexterity: 5,
                    agility: 15,
                    aura: 5,
                    charisma: 10,
                    discipline: -15
                },
                baseHp: 150,
                baseWeight: 70,
            },
            dwarf: {
                name: 'Dwarf',
                description: 'Dwarves are the most sturdy',
                statBonusModifiers: {
                    constitution: 15,
                    strength: 10,
                    discipline: 10,
                    logic: 5,
                    agility: -5,
                    aura: -10,
                    charisma: -10
                },
                baseHp: 150,
                baseWeight: 77,
            },
            halfling: {
                name: 'Halfling',
                description: 'Halflings are the most agile',
                statBonusModifiers: {
                    constitution: 10,
                    dexterity: 15,
                    agility: 10,
                    logic: 5,
                    intelligence: 10,
                    strength: -15,
                    discipline: -5,
                    charisma: -5,
                    aura: -5
                },
                baseHp: 100,
                baseWeight: 45,
            },
            highman: {
                name: 'Highman',
                description: 'Highmen are the most noble',
                statBonusModifiers: {
                    strength: 15,
                    constitution: 10,
                    charisma: 5,
                    dexterity: -5,
                    agility: -5,
                    aura: -5,
                    logic: -5
                },
                baseHp: 200,
                baseWeight: 120,
            }
        }

        return races;
    }
}
module.exports = PlayerRace;
