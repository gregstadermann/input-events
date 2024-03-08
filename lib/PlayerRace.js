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

    static getRaces() {
        if (races) {
            return races;
        }

        races = {
            human: {
                name: 'Human',
                description: 'Humans are the most common'
            },
            elf: {
                name: 'Elf',
                description: 'Elves are the most magical'
            },
            dwarf: {
                name: 'Dwarf',
                description: 'Dwarves are the most sturdy'
            },
            highman: {
                name: 'Highman',
                description: 'Highmen are the most noble'
            }
        }

        return races;
    }
}
module.exports = PlayerRace;
