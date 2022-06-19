export const settingsKey = "roll-new-character-stats";

export function registerSettings() {

    game.settings.register(settingsKey, "d6Method", {
        name: game.i18n.localize("RNCS.settings.d6Method.Name"),
        hint: game.i18n.localize("RNCS.settings.d6Method.Hint"),
        scope: "world",
        config: true,
        type: String,
        choices: {
            "0": game.i18n.localize("RNCS.settings.d6Method.choices.0"),
            "1": game.i18n.localize("RNCS.settings.d6Method.choices.1"),
            "2": game.i18n.localize("RNCS.settings.d6Method.choices.2")
        },
        default: "0"
    });

    game.settings.register(settingsKey, "DropLowestDieRoll", {
        name: game.i18n.localize("RNCS.settings.DropLowestDieRoll.Name"),
        hint: game.i18n.localize("RNCS.settings.DropLowestDieRoll.Hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(settingsKey, "ReRollOnes", {
        name: game.i18n.localize("RNCS.settings.ReRollOnes.Name"),
        hint: game.i18n.localize("RNCS.settings.ReRollOnes.Hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(settingsKey, "NumberOfSetsRolls", {
        name: game.i18n.localize("RNCS.settings.NumberOfSetsRolls.Name"),
        hint: game.i18n.localize("RNCS.settings.NumberOfSetsRolls.Hint"),
        scope: "world",
        config: true,
        type: String,
        choices: {
            "0": game.i18n.localize("RNCS.settings.NumberOfSetsRolls.choices.0"),
            "1": game.i18n.localize("RNCS.settings.NumberOfSetsRolls.choices.1")
        },
        default: "0"
    });

    game.settings.register(settingsKey, "DropLowestSet", {
        name: game.i18n.localize("RNCS.settings.DropLowestSet.Name"),
        hint: game.i18n.localize("RNCS.settings.DropLowestSet.Hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(settingsKey, "BonusPoints", {
        name: game.i18n.localize("RNCS.settings.BonusPoints.Name"),
        hint: game.i18n.localize("RNCS.settings.BonusPoints.Hint"),
        scope: "world",
        config: true,
        type: String,
        choices: {
            "0": game.i18n.localize("RNCS.settings.BonusPoints.choices.0"),
            "1": game.i18n.localize("RNCS.settings.BonusPoints.choices.1"),
            "2": game.i18n.localize("RNCS.settings.BonusPoints.choices.2")
        },
        default: "0"
    });

    game.settings.register(settingsKey, "Over18Allowed", {
        name: game.i18n.localize("RNCS.settings.Over18Allowed.Name"),
        hint: game.i18n.localize("RNCS.settings.Over18Allowed.Hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(settingsKey, "DistributeResults", {
        name: game.i18n.localize("RNCS.settings.DistributeResults.Name"),
        hint: game.i18n.localize("RNCS.settings.DistributeResults.Hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
	//console.log(settingsKey + " | Initialized Settings");
}