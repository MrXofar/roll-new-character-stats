import { RNCS } from "./main.js";
export const settingsKey = "roll-new-character-stats";

// ***********************************************************************************************
//
// MAKE SURE YOU ADD NEW SETTINGS TO ./registered-settings.js 
//
// ***********************************************************************************************

export function registerSettings() {

    game.settings.register(settingsKey, "ForceDefaultSettings", {
        scope: "world",
        config: false,
        type: Boolean,
        default: false
    });

    game.settings.register(RNCS.ID, "version", {
		scope: "world",
		config: false,
		default: "0.0.0",
		type: String,
		onChange: () => {
			if (!game.user.isGM || game.settings.get(RNCS.ID,"ForceDefaultSettings") === false) return;
			new Dialog({
				title: `RNCS | ${game.i18n.localize("RNCS.settings.version.title")}`,
				content: game.i18n.localize("RNCS.settings.version.content"),
				buttons: {
					yes: {
						label: game.i18n.localize("OK"),
						callback: () => {
							RNCS.restoreDefaultSettings();
						},
					},
				},
				default: "yes",
			}).render(true);
		},
	});    

	game.settings.registerMenu(settingsKey, "ChatSettings", {
		name: "",
		hint: game.i18n.localize("RNCS.settings.ChatSettings.Hint"),
		label: game.i18n.localize("RNCS.settings.ChatSettings.Name"),
		icon: "fas fa-comments",
		type: ChatSettings,
		restricted: true,
	})
    
	game.settings.registerMenu(settingsKey, "RollMethodAndDistribution", {
		name: "",
		hint: game.i18n.localize("RNCS.settings.RollMethodAndDistribution.Hint"),
		label: game.i18n.localize("RNCS.settings.RollMethodAndDistribution.Name"),
		icon: "fas fa-dice",
		type: RollAndDistributionMethodSettings,
		restricted: true,
	})

    game.settings.register(settingsKey, "NumberOfActors", {
        name: game.i18n.localize("RNCS.settings.NumberOfActors.Name"),
        hint: game.i18n.localize("RNCS.settings.NumberOfActors.Hint"),
        scope: "client",
        config: true,
        type: Number,
        default: 1
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
            "player-occupation": game.i18n.localize("RNCS.settings.NameFormat.choices.player-occupation"),
            "occupation-player": game.i18n.localize("RNCS.settings.NameFormat.choices.occupation-player"),
            "occupation"       : game.i18n.localize("RNCS.settings.NameFormat.choices.occupation"),
            "random"           : game.i18n.localize("RNCS.settings.NameFormat.choices.random")
        },
        default: "player-occupation"
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

    game.settings.register(settingsKey, "ShowOtherPropertyResults", {
        name: game.i18n.localize("RNCS.settings.ShowOtherPropertyResults.Name"),
        hint: game.i18n.localize("RNCS.settings.ShowOtherPropertyResults.Hint"),
        scope: "world",
        config: game.system.id === "dcc",
        type: String,
        choices: {
            "do-not-show": game.i18n.localize("RNCS.settings.ShowOtherPropertyResults.choices.do-not-show"),
            "with-result": game.i18n.localize("RNCS.settings.ShowOtherPropertyResults.choices.with-result"),
            "in-place-of": game.i18n.localize("RNCS.settings.ShowOtherPropertyResults.choices.in-place-of")
        },
        default: "do-not-show"
    });

    game.settings.register(settingsKey, "IncludeResultDescription", {
        name: game.i18n.localize("RNCS.settings.IncludeResultDescription.Name"),
        hint: game.i18n.localize("RNCS.settings.IncludeResultDescription.Hint"),
        scope: "client",
        config: game.system.id === "dcc",
        type: Boolean,
        default: true
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

    game.settings.register(settingsKey, "ChatShowTotalAbilityScore", {
        name: game.i18n.localize("RNCS.settings.ChatShowTotalAbilityScore.Name"),
        hint: game.i18n.localize("RNCS.settings.ChatShowTotalAbilityScore.Hint"),
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
        type: Number,
        choices: {
            "3": game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.3"),
            "4": game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.4"),
            "2": game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.2")
        },
        default: 3
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
        type: Number,
        choices: {
            "6": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.6"),
            "7": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.7"),
            "8": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.8"),
            "9": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.9")
        },
        default: 6
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
            "zero-points": game.i18n.localize("RNCS.settings.BonusPoints.choices.zero-points"),
            "one-point"  : game.i18n.localize("RNCS.settings.BonusPoints.choices.one-point"),
            "one-d-four" : game.i18n.localize("RNCS.settings.BonusPoints.choices.one-d-four")
        },
        default: "zero-points"
    });

    game.settings.register(settingsKey, "Over18Allowed", {
        name: game.i18n.localize("RNCS.settings.Over18Allowed.Name"),
        hint: game.i18n.localize("RNCS.settings.Over18Allowed.Hint"),
        scope: "world",
        config: false,
        type: Boolean,
        default: false
    });

    game.settings.register(settingsKey, "MinimumAbilityTotal", {
        name: game.i18n.localize("RNCS.settings.MinimumAbilityTotal.Name"),
        hint: game.i18n.localize("RNCS.settings.MinimumAbilityTotal.Hint"),
        scope: "world",
        config: false,
        type: Number,
        default: 0,
		restricted: true,
    });

    game.settings.register(settingsKey, "MaximumAbilityTotal", {
        name: game.i18n.localize("RNCS.settings.MaximumAbilityTotal.Name"),
        hint: game.i18n.localize("RNCS.settings.MaximumAbilityTotal.Hint"),
        scope: "world",
        config: false,
        type: Number,
        default: 0,
		restricted: true,
    });

    game.settings.register(settingsKey, "DistributionMethod", {
        name: game.i18n.localize("RNCS.settings.DistributionMethod.Name"),
        hint: game.i18n.localize("RNCS.settings.DistributionMethod.Hint"),
        scope: "world",
        config: false,
        type: String,
        choices: {
            "apply-as-rolled"  : game.i18n.localize("RNCS.settings.DistributionMethod.choices.apply-as-rolled"  ),
            "distribute-freely": game.i18n.localize("RNCS.settings.DistributionMethod.choices.distribute-freely"),
            "ring-method"      : game.i18n.localize("RNCS.settings.DistributionMethod.choices.ring-method"      )
        },
        default: "apply-as-rolled"
    });
    // END Roll & Distribution Method Settings
    
    // game.settings.register(settingsKey, "SettingName", {
    //     name: game.i18n.localize("RNCS.settings.SettingName.Name"),
    //     hint: game.i18n.localize("RNCS.settings.SettingName.Hint"),
    //     scope: "world",
    //     config: true,
    //     type: Boolean,
    //     default: false
    // });

    // game.settings.register(settingsKey, "SettingName", {
    //     name: game.i18n.localize("RNCS.settings.SettingName.Name"),
    //     hint: game.i18n.localize("RNCS.settings.SettingName.Hint"),
    //     scope: "world",
    //     config: true,
    //     type: String,
    //     choices: {
    //         "0": game.i18n.localize("RNCS.settings.SettingName.choices.0"),
    //         "1": game.i18n.localize("RNCS.settings.SettingName.choices.1"),
    //         "2": game.i18n.localize("RNCS.settings.SettingName.choices.2")
    //     },
    //     default: "0"
    // });

	console.log(RNCS.ID + " | Registered Settings");
}

Hooks.on('renderChatSettings', () => {
    Intitialize();
});
    
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
            ChatShowTotalAbilityScore_value:      game.settings.get(settingsKey, "ChatShowTotalAbilityScore"),
            ChatShowCondensedResults_value:       game.settings.get(settingsKey, "ChatShowCondensedResults"),
            ChatShowDieResultSet_value:           game.settings.get(settingsKey, "ChatShowDieResultSet"),
            ChatShowBonusPointsText_value:        game.settings.get(settingsKey, "ChatShowBonusPointsText"),
            ChatShowDifficultyText_value:         game.settings.get(settingsKey, "ChatShowDifficultyText"),
            ChatShowNoteFromDM_value:             game.settings.get(settingsKey, "ChatShowNoteFromDM")
        }
    }
    
    async _updateObject(event, formData) {
        if(event.submitter.id !== "cancel"){
            game.settings.set(settingsKey, "ChatRemoveConfigureActorButton", formData.rncs_ChatRemoveConfigureActorButton),
            game.settings.set(settingsKey, "ChatShowDescription", formData.rncs_ChatShowDescription),
            game.settings.set(settingsKey, "ChatShowMethodText", formData.rncs_ChatShowMethodText),
            game.settings.set(settingsKey, "ChatShowResultsText", formData.rncs_ChatShowResultsText),
            game.settings.set(settingsKey, "ChatShowTotalAbilityScore", formData.rncs_ChatShowTotalAbilityScore),
            game.settings.set(settingsKey, "ChatShowCondensedResults", formData.rncs_ChatShowCondensedResults),
            game.settings.set(settingsKey, "ChatShowDieResultSet", formData.rncs_ChatShowDieResultSet),
            game.settings.set(settingsKey, "ChatShowBonusPointsText", formData.rncs_ChatShowBonusPointsText),
            game.settings.set(settingsKey, "ChatShowDifficultyText", formData.rncs_ChatShowDifficultyText),
            game.settings.set(settingsKey, "ChatShowNoteFromDM", formData.rncs_ChatShowNoteFromDM)
        }
    }
}

class RollAndDistributionMethodSettings extends FormApplication {

    AbilitiesRollMethod_choices = {// choices.# represents number of d6
        "3": game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.3"),
        "4": game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.4"),
        "2": game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.2"),
    }

    NumberOfSetsRolled_choices = {
        "6": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.6" ),
        "7": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.7"),
        "8": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.8"),
        "9": game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices.9")
    }

    BonusPoints_choices = {
        "zero-points": game.i18n.localize("RNCS.settings.BonusPoints.choices.zero-points"),
        "one-point"  : game.i18n.localize("RNCS.settings.BonusPoints.choices.one-point"),
        "one-d-four" : game.i18n.localize("RNCS.settings.BonusPoints.choices.one-d-four"),
    }

    DistributionMethod_choices = {
        "apply-as-rolled"  : game.i18n.localize("RNCS.settings.DistributionMethod.choices.apply-as-rolled"  ),
        "distribute-freely": game.i18n.localize("RNCS.settings.DistributionMethod.choices.distribute-freely"),
        "ring-method"      : game.i18n.localize("RNCS.settings.DistributionMethod.choices.ring-method"      ),
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "rncs-roll-dist-method",
            title: "RNCS - " + game.i18n.localize("RNCS.settings.ChatShowMethodText.Name"),
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
            MinimumAbilityTotal_value       :game.settings.get(settingsKey, "MinimumAbilityTotal"),
            MaximumAbilityTotal_value       :game.settings.get(settingsKey, "MaximumAbilityTotal"),
            DistributionMethod_choices      :this.DistributionMethod_choices,
            DistributionMethod_value        :game.settings.get(settingsKey, "DistributionMethod")
        }
    }
    
    async _updateObject(event, formData) {
        if(event.submitter.id !== "cancel"){
            game.settings.set(settingsKey, "AbilitiesRollMethod",  formData.rncs_AbilitiesRollMethod),
            game.settings.set(settingsKey, "DropLowestDieRoll",    formData.rncs_DropLowestDieRoll),
            game.settings.set(settingsKey, "ReRollOnes",           formData.rncs_ReRollOnes),
            game.settings.set(settingsKey, "NumberOfSetsRolled",   formData.rncs_NumberOfSetsRolled),
            game.settings.set(settingsKey, "DropLowestSet",        formData.rncs_DropLowestSet),
            game.settings.set(settingsKey, "BonusPoints",          formData.rncs_BonusPoints),
            game.settings.set(settingsKey, "Over18Allowed",        formData.rncs_Over18Allowed),
            game.settings.set(settingsKey, "MinimumAbilityTotal",  formData.rncs_MinimumAbilityTotal),
            game.settings.set(settingsKey, "MaximumAbilityTotal",  formData.rncs_MaximumAbilityTotal),
            game.settings.set(settingsKey, "DistributionMethod",   formData.rncs_DistributionMethod)
        }
    }
}