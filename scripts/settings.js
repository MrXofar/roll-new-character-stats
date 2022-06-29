import { RollNewCharacterStats } from "./main.js";
export const settingsKey = "roll-new-character-stats";

export function registerSettings() {

    game.settings.register(settingsKey, "AbilitiesRollMethod", {
        name: game.i18n.localize("RNCS.settings.AbilitiesRollMethod.Name"),
        hint: game.i18n.localize("RNCS.settings.AbilitiesRollMethod.Hint"),
        scope: "world",
        config: true,
        type: String,
        choices: {
            "0": game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.0"),
            "1": game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.1"),
            "2": game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.2")
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

    game.settings.register(settingsKey, "NumberOfRolls", {
        name: game.i18n.localize("RNCS.settings.NumberOfRolls.Name"),
        hint: game.i18n.localize("RNCS.settings.NumberOfRolls.Hint"),
        scope: "world",
        config: true,
        type: String,
        choices: {
            "0": game.i18n.localize("RNCS.settings.NumberOfRolls.choices.0"),
            "1": game.i18n.localize("RNCS.settings.NumberOfRolls.choices.1")
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
	console.log(RollNewCharacterStats.ID + " | Registered Settings");
}