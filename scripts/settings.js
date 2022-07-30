import { RollNewCharacterStats } from "./main.js";
export const settingsKey = "roll-new-character-stats";

// ***********************************************************************************************
//
// MAKE SURE YOU ADD NEW SETTINGS TO ./registered-settings.js 
//
// ***********************************************************************************************

export function registerSettings() {
    
	game.settings.registerMenu(settingsKey, "ChatSettings", {
		name: "",
		hint: "RNCS.settings.ChatSettings.Hint",
		label: "RNCS.settings.ChatSettings.Name",
		icon: "fas fa-comments",
		type: ChatSettings,
		restricted: true,
	})
    
	game.settings.registerMenu(settingsKey, "RollMethodAndDistribution", {
		name: "",
		hint: "RNCS.settings.RollMethodAndDistribution.Hint",
		label: "RNCS.settings.RollMethodAndDistribution.Name",
		icon: "fas fa-dice",
		type: RollAndDistributionMethod,
		restricted: true,
	})

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
        default: true
    });

    // BEGIN Config Actor Settings
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

    game.settings.register(settingsKey, "HideResultsZone", {
        name: game.i18n.localize("RNCS.settings.HideResultsZone.Name"),
        hint: game.i18n.localize("RNCS.settings.HideResultsZone.Hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(settingsKey, "ReverseRingMethodScrolling", {
        name: game.i18n.localize("RNCS.settings.ReverseRingMethodScrolling.Name"),
        hint: game.i18n.localize("RNCS.settings.ReverseRingMethodScrolling.Hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: false
    });
    // END Config Actor Settings

    // BEGIN Chat Settings 
    game.settings.register(settingsKey, "ChatRemoveConfigureActorButton", {
        name: game.i18n.localize("RNCS.settings.ChatRemoveConfigureActorButton.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatRemoveConfigureActorButton.Hint"),
        scope: "world",
        config: false,
        type: Boolean,
        default: true
    });

    game.settings.register(settingsKey, "ChatShowDescription", {
        name: game.i18n.localize("RNCS.settings.ChatShowDescription.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowDescription.Hint"),
        scope: "world",
        config: false,//game.system.id === "dcc",
        type: Boolean,
        default: true
    });

    game.settings.register(settingsKey, "ChatShowMethodText", {
        name: game.i18n.localize("RNCS.settings.ChatShowMethodText.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowMethodText.Hint"),
        scope: "world",
        config: false,
        type: Boolean,
        default: true
    });

    game.settings.register(settingsKey, "ChatShowResultsText", {
        name: game.i18n.localize("RNCS.settings.ChatShowResultsText.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowResultsText.Hint"),
        scope: "world",
        config: false,
        type: Boolean,
        default: true
    });

    game.settings.register(settingsKey, "ChatShowCondensedResults", {
        name: game.i18n.localize("RNCS.settings.ChatShowCondensedResults.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowCondensedResults.Hint"),
        scope: "world",
        config: false,
        type: Boolean,
        default: true
    });

    game.settings.register(settingsKey, "ChatShowDieResultSet", {
        name: game.i18n.localize("RNCS.settings.ChatShowDieResultSet.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowDieResultSet.Hint"),
        scope: "world",
        config: false,
        type: Boolean,
        default: true
    });
    
    game.settings.register(settingsKey, "ChatShowBonusPointsText", {
        name: game.i18n.localize("RNCS.settings.ChatShowBonusPointsText.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowBonusPointsText.Hint"),
        scope: "world",
        config: false,
        type: Boolean,
        default: true
    });

    game.settings.register(settingsKey, "ChatShowDifficultyText", {
        name: game.i18n.localize("RNCS.settings.ChatShowDifficultyText.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowDifficultyText.Hint"),
        scope: "world",
        config: false,
        type: Boolean,
        default: true
    });

    game.settings.register(settingsKey, "ChatShowNoteFromDM", {
        name: game.i18n.localize("RNCS.settings.ChatShowNoteFromDM.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowNoteFromDM.Hint"),
        scope: "world",
        config: false,
        type: Boolean,
        default: true
    });    
    // END Chat Settings 

    // BEGIN Roll & Distribution Method Settings
    game.settings.register(settingsKey, "AbilitiesRollMethod", {
        name: game.i18n.localize("RNCS.settings.AbilitiesRollMethod.Name"),
        hint: game.i18n.localize("RNCS.settings.AbilitiesRollMethod.Hint"),
        scope: "world",
        config: false,
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
        config: false,
        type: Boolean,
        default: false
    });

    game.settings.register(settingsKey, "ReRollOnes", {
        name: game.i18n.localize("RNCS.settings.ReRollOnes.Name"),
        hint: game.i18n.localize("RNCS.settings.ReRollOnes.Hint"),
        scope: "world",
        config: false,
        type: Boolean,
        default: false
    });

    game.settings.register(settingsKey, "NumberOfSetsRolled", {
        name: game.i18n.localize("RNCS.settings.NumberOfSetsRolled.Name"),
        hint: game.i18n.localize("RNCS.settings.NumberOfSetsRolled.Hint"),
        scope: "world",
        config: false,
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
        config: false,
        type: Boolean,
        default: false
    });

    game.settings.register(settingsKey, "BonusPoints", {
        name: game.i18n.localize("RNCS.settings.BonusPoints.Name"),
        hint: game.i18n.localize("RNCS.settings.BonusPoints.Hint"),
        scope: "world",
        config: false,
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
        config: false,
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
        config: false,
        type: String,
        choices: {
            "0": game.i18n.localize("RNCS.settings.DistributionMethod.choices.0"),
            "1": game.i18n.localize("RNCS.settings.DistributionMethod.choices.1"),
            "2": game.i18n.localize("RNCS.settings.DistributionMethod.choices.2")
        },
        default: "0"
    });
    // END Roll & Distribution Method Settings
    
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
    
class ChatSettings extends FormApplication {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "rncs-chat-settings",
            title: "RNCS - Edit Chat Settings",
            template: "./modules/roll-new-character-stats/templates/form-apps/edit-chat-settings.hbs",
            width:500,
            closeOnSubmit: true,
            submitOnClose: false
        })
    }

    async getData(){
        return{
            ChatRemoveConfigureActorButton_value: game.settings.get(settingsKey, "ChatRemoveConfigureActorButton"),
            ChatShowDescription_value:            game.settings.get(settingsKey, "ChatShowDescription"),
            ChatShowMethodText_value:             game.settings.get(settingsKey, "ChatShowMethodText"),
            ChatShowResultsText_value:            game.settings.get(settingsKey, "ChatShowResultsText"),
            ChatShowCondensedResults_value:       game.settings.get(settingsKey, "ChatShowCondensedResults"),
            ChatShowDieResultSet_value:           game.settings.get(settingsKey, "ChatShowDieResultSet"),
            ChatShowBonusPointsText_value:        game.settings.get(settingsKey, "ChatShowBonusPointsText"),
            ChatShowDifficultyText_value:         game.settings.get(settingsKey, "ChatShowDifficultyText"),
            ChatShowNoteFromDM_value:             game.settings.get(settingsKey, "ChatShowNoteFromDM")
        }
    }
    
    async _updateObject(event, formData) {
        if(event.submitter.id !== "cancel"){
            game.settings.set("roll-new-character-stats", "ChatRemoveConfigureActorButton", formData.rncs_ChatRemoveConfigureActorButton),
            game.settings.set("roll-new-character-stats", "ChatShowDescription", formData.rncs_ChatShowDescription),
            game.settings.set("roll-new-character-stats", "ChatShowMethodText", formData.rncs_ChatShowMethodText),
            game.settings.set("roll-new-character-stats", "ChatShowResultsText", formData.rncs_ChatShowResultsText),
            game.settings.set("roll-new-character-stats", "ChatShowCondensedResults", formData.rncs_ChatShowCondensedResults),
            game.settings.set("roll-new-character-stats", "ChatShowDieResultSet", formData.rncs_ChatShowDieResultSet),
            game.settings.set("roll-new-character-stats", "ChatShowBonusPointsText", formData.rncs_ChatShowBonusPointsText),
            game.settings.set("roll-new-character-stats", "ChatShowDifficultyText", formData.rncs_ChatShowDifficultyText),
            game.settings.set("roll-new-character-stats", "ChatShowNoteFromDM", formData.rncs_ChatShowNoteFromDM)
        }
    }
}

class RollAndDistributionMethod extends FormApplication {

    AbilitiesRollMethod_choices = {
        "0": game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.0"),
        "1": game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.1"),
        "2": game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.2"),
    }

    NumberOfSetsRolled_choices = {
        "0": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.0"),
        "1": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.1"),
        "2": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.2"),
        "3": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.3")
    }

    BonusPoints_choices = {
        "0": game.i18n.localize("RNCS.settings.BonusPoints.choices.0"),
        "1": game.i18n.localize("RNCS.settings.BonusPoints.choices.1"),
        "2": game.i18n.localize("RNCS.settings.BonusPoints.choices.2"),
    }

    DistributionMethod_choices = {
        "0": game.i18n.localize("RNCS.settings.DistributionMethod.choices.0"),
        "1": game.i18n.localize("RNCS.settings.DistributionMethod.choices.1"),
        "2": game.i18n.localize("RNCS.settings.DistributionMethod.choices.2"),
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "rncs-roll-dist-method",
            title: "RNCS - Edit Roll & Distribution Method",
            template: "./modules/roll-new-character-stats/templates/form-apps/edit-roll-dist-method.hbs",
            width:500,
            closeOnSubmit: true,
            submitOnClose: false
        })
    }

    async getData(){
        return{
            AbilitiesRollMethod_choices     :this.AbilitiesRollMethod_choices,
            AbilitiesRollMethod_value       :game.settings.get(settingsKey, "AbilitiesRollMethod"),
            DropLowestDieRoll_value         :game.settings.get(settingsKey, "DropLowestDieRoll"),
            ReRollOnes_value                :game.settings.get(settingsKey, "ReRollOnes"),
            NumberOfSetsRolled_choices      :this.NumberOfSetsRolled_choices,
            NumberOfSetsRolled_value        :game.settings.get(settingsKey, "NumberOfSetsRolled"),
            DropLowestSet_value             :game.settings.get(settingsKey, "DropLowestSet"),
            BonusPoints_choices             :this.BonusPoints_choices,
            BonusPoints_value               :game.settings.get(settingsKey, "BonusPoints"),
            Over18Allowed_value             :game.settings.get(settingsKey, "Over18Allowed"),
            DistributionMethod_choices      :this.DistributionMethod_choices,
            DistributionMethod_value        :game.settings.get(settingsKey, "DistributionMethod")
        }
    }
    
    async _updateObject(event, formData) {
        if(event.submitter.id !== "cancel"){
            game.settings.set("roll-new-character-stats", "AbilitiesRollMethod",  formData.rncs_AbilitiesRollMethod),
            game.settings.set("roll-new-character-stats", "DropLowestDieRoll",    formData.rncs_DropLowestDieRoll),
            game.settings.set("roll-new-character-stats", "ReRollOnes",           formData.rncs_ReRollOnes),
            game.settings.set("roll-new-character-stats", "NumberOfSetsRolled",   formData.rncs_NumberOfSetsRolled),
            game.settings.set("roll-new-character-stats", "DropLowestSet",        formData.rncs_DropLowestSet),
            game.settings.set("roll-new-character-stats", "BonusPoints",          formData.rncs_BonusPoints),
            game.settings.set("roll-new-character-stats", "Over18Allowed",        formData.rncs_Over18Allowed),
            game.settings.set("roll-new-character-stats", "DistributionMethod",   formData.rncs_DistributionMethod)
        }
    }
}