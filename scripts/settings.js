import { RollNewCharacterStats } from "./main.js";
export const settingsKey = "roll-new-character-stats";

// ***********************************************************************************************
//
// MAKE SURE YOU ADD NEW SETTINGS TO ./registered-settings.js 
//
// ***********************************************************************************************

export function registerSettings() {

    game.settings.register(settingsKey, "NumberOfActors", {
        name: game.i18n.localize("RNCS.settings.NumberOfActors.Name"),
        hint: game.i18n.localize("RNCS.settings.NumberOfActors.Hint"),
        scope: "client",
        config: true,
        type: Number,
        default: "1"
    });

    game.settings.register(settingsKey, "DiceSoNiceEnabled", {
        name: game.i18n.localize("RNCS.settings.DiceSoNiceEnabled.Name"),
        hint: game.i18n.localize("RNCS.settings.DiceSoNiceEnabled.Hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: "1"
    });

    game.settings.register(settingsKey, "NameFormat", {
        name: game.i18n.localize("RNCS.settings.NameFormat.Name"),
        hint: game.i18n.localize("RNCS.settings.NameFormat.Hint"),
        scope: "world",
        config: game.system.id === "dcc",
        type: String,
        choices: {
            "0": game.i18n.localize("RNCS.settings.NameFormat.choices.0"),
            "1": game.i18n.localize("RNCS.settings.NameFormat.choices.1"),
            "2": game.i18n.localize("RNCS.settings.NameFormat.choices.2"),
            "3": game.i18n.localize("RNCS.settings.NameFormat.choices.3")
        },
        default: "0"
    });

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

    game.settings.register(settingsKey, "NumberOfSetsRolled", {
        name: game.i18n.localize("RNCS.settings.NumberOfSetsRolled.Name"),
        hint: game.i18n.localize("RNCS.settings.NumberOfSetsRolled.Hint"),
        scope: "world",
        config: true,
        type: String,
        choices: {
            "0": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.0"),
            "1": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.1"),
            "2": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.2"),
            "3": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.3")
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

    // game.settings.register(settingsKey, "DistributeResults", {
    //     name: game.i18n.localize("RNCS.settings.DistributeResults.Name"),
    //     hint: game.i18n.localize("RNCS.settings.DistributeResults.Hint"),
    //     scope: "world",
    //     config: false,  // deprecated in v3.1.0
    //     type: Boolean,
    //     default: false
    // });

    game.settings.register(settingsKey, "DistributionMethod", {
        name: game.i18n.localize("RNCS.settings.DistributionMethod.Name"),
        hint: game.i18n.localize("RNCS.settings.DistributionMethod.Hint"),
        scope: "world",
        config: true,
        type: String,
        choices: {
            "0": game.i18n.localize("RNCS.settings.DistributionMethod.choices.0"),
            "1": game.i18n.localize("RNCS.settings.DistributionMethod.choices.1"),
            "2": game.i18n.localize("RNCS.settings.DistributionMethod.choices.2")
        },
        default: "0"
    });

    game.settings.register(settingsKey, "HideResultsZone", {
        name: game.i18n.localize("RNCS.settings.HideResultsZone.Name"),
        hint: game.i18n.localize("RNCS.settings.HideResultsZone.Hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(settingsKey, "ChatRemoveConfigureActorButton", {
        name: game.i18n.localize("RNCS.settings.ChatRemoveConfigureActorButton.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatRemoveConfigureActorButton.Hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(settingsKey, "ChatShowDescription", {
        name: game.i18n.localize("RNCS.settings.ChatShowDescription.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowDescription.Hint"),
        scope: "world",
        config: game.system.id === "dcc",
        type: Boolean,
        default: true
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

    game.settings.register(settingsKey, "ChatShowCondensedResults", {
        name: game.i18n.localize("RNCS.settings.ChatShowCondensedResults.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowCondensedResults.Hint"),
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