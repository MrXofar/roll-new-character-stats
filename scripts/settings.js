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

    game.settings.register(settingsKey, "ChatShowMethodText", {
        name: game.i18n.localize("RNCS.settings.ChatShowMethodText.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowMethodText.Hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(settingsKey, "ChatShowResultsText", {
        name: game.i18n.localize("RNCS.settings.ChatShowResultsText.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowResultsText.Hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });
    
    game.settings.register(settingsKey, "ChatShowBonusPointsText", {
        name: game.i18n.localize("RNCS.settings.ChatShowBonusPointsText.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowBonusPointsText.Hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(settingsKey, "ChatShowDifficultyText", {
        name: game.i18n.localize("RNCS.settings.ChatShowDifficultyText.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowDifficultyText.Hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(settingsKey, "ChatShowNoteFromDM", {
        name: game.i18n.localize("RNCS.settings.ChatShowNoteFromDM.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowNoteFromDM.Hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });
    
    // game.settings.register(settingsKey, "setting_name", {
    //     name: game.i18n.localize("RNCS.settings.setting_name.Name"),
    //     hint: game.i18n.localize("RNCS.settings.setting_name.Hint"),
    //     scope: "world",
    //     config: true,
    //     type: Boolean,
    //     default: false
    // });

    // game.settings.register(settingsKey, "setting_name", {
    //     name: game.i18n.localize("RNCS.settings.setting_name.Name"),
    //     hint: game.i18n.localize("RNCS.settings.setting_name.Hint"),
    //     scope: "world",
    //     config: true,
    //     type: String,
    //     choices: {
    //         "0": game.i18n.localize("RNCS.settings.setting_name.choices.0"),
    //         "1": game.i18n.localize("RNCS.settings.setting_name.choices.1"),
    //         "2": game.i18n.localize("RNCS.settings.setting_name.choices.2")
    //     },
    //     default: "0"
    // });

	console.log(RollNewCharacterStats.ID + " | Registered Settings");
}