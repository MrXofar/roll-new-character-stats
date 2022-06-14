export const settingsKey = "roll-new-character-stats";

export function registerSettings() {

    game.settings.register(settingsKey, "d6Method", {
        name: "#d6 Method",
        hint: "How many d6 are rolled and retained?",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "0": "3d6 - Keep All",
            "1": "4d6 - Drop Lowest",
            "2": "2d6+6 - Keep All"
        },
        default: "0"
    });

    game.settings.register(settingsKey, "ReRollOnes", {
        name: "Reroll Ones?",
        hint: "This setting will cause 1's to be rerolled until a 1 is not rolled.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(settingsKey, "NumberOfSetsRolls", {
        name: "Number of Sets Rolled",
        hint: "How many sets d6 are rolled and retained?",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "0": "6 Rolls - Keep All",
            "1": "7 Rolls - Drop Lowest"
        },
        default: "0"
    });

    game.settings.register(settingsKey, "BonusPoints", {
        name: "Bonus Points",
        hint: "How many bonus points awarded?",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "0": "0 Bonus Points",
            "1": "1 Bonus Point",
            "2": "1d4 Bonus Points"
        },
        default: "0"
    });

    game.settings.register(settingsKey, "Over18Allowed", {
        name: "Scores Over 18 Allowed?",
        hint: "This setting will allow scores over 18 at first level after adding bonuses.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(settingsKey, "DistributeResults", {
        name: "Distribute Results?",
        hint: "This setting will allow distribution of results freely among attributes.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
	console.log(settingsKey + " | Initialized Settings");
}