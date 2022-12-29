import { registerSettings } from "./settings.js";
import { RegisteredSettings } from "./registered-settings.js";
import { DiceRoller}  from './dice-roller.js';
import { Controls } from './controls.js';
import { ConfigureActor } from './form-apps/configure-actor.js';

Hooks.once("init", () => {
	registerSettings();

	// Register Handlebars helpers
	Handlebars.registerHelper("add", function (a, b) {
		return a + b;
	});
	Handlebars.registerHelper("for", function (from, to, incr, block) {
		let accum = '';
		for (let i = from; i < to; i += incr)
			accum += block.fn(i);
		return accum;
	});
	// I know there is a more robust option out there for handlebars logic, 
	// but this will suffice for the only spot I need OR logic at the moment
	Handlebars.registerHelper("if_AorB", function (a, b, options) {
		if (a || b){return options.fn(this);}else{options.inverse(this);}
	});
	console.log(RNCS.ID + " | Initialized")

});

Hooks.on('getSceneControlButtons', (controls) => {
	new Controls().initializeControls(controls);
});

Hooks.on("renderChatMessage", (app, [html]) => {
	//Hide buttons with class "card-buttons rncs-configure-new-actor"
	const button = html.querySelectorAll(".rncs-configure-new-actor")
	if (!game.user.can("ACTOR_CREATE")) {
		for (let i = 0; i < button.length; i += 1) {
			button[i].classList.add("rncs-display-none");
		}
	}
});

Hooks.on("renderChatLog", (app, [html]) => {
	html.addEventListener("click", ({ target }) => {
		const msgId = target.closest(".chat-message[data-message-id]")?.dataset.messageId;
		if (msgId && target.matches(".chat-card button") && target.dataset.action === "configure_new_actor") {
			const msg = game.messages.get(msgId);
			const flags = msg.flags.roll_new_character_stats;

			const owner_id = flags.owner_id;
			const final_results = flags.final_results;
			const bonus_points = flags.bonus_points; 
			const other_properties_results = flags.other_properties_results;
			const individual_rolls = flags.individual_rolls;  
			const Over18Allowed = flags.Over18Allowed;
			const HideResultsZone = flags.HideResultsZone;
			const DistributionMethod = flags.DistributionMethod;
			FormApp_ConfigureActor(target, 
								   msgId, 
								   owner_id, 
								   final_results, 
								   bonus_points, 
								   other_properties_results, 
								   individual_rolls, 
								   Over18Allowed,
								   HideResultsZone,
								   DistributionMethod);
		}
	});
}); 

Hooks.on("ready", () => {	
	if(game.user.isGM) { VersionUpdateValidation(); }
});

async function VersionUpdateValidation(){

	// Report current module.json version
	let module_version = game.modules.get(RNCS.ID).version;
	console.log("RNCS | current module.json version:" + module_version);

	// Report old version; game.settings.version.default === "0.0.0"
	let old_version = game.settings.get(RNCS.ID, "version");
	if(old_version !== module_version){
		console.log("RNCS | game.setting old version:" + old_version);
	}
	
	// v3.1.4 - game.setting "BonusPoints" choices (and some others) were converted to human friendly values 
	// replacing their numerical values; such as "0", "1", "2" etc.
	// If a setting value !isNaN, then that means it is numeric and settings need to be restored to default.
	// A notification will popup to inform the user.
	if(!isNaN(game.settings.get(RNCS.ID, "BonusPoints"))){	
		console.log("RNCS | ForceDefaultSettings...");	
		await game.settings.set(RNCS.ID, "ForceDefaultSettings", true);
	}

	// PLACEHOLDER COMMENT
	// Do things based on module version change here if they need to be complete prior to the version setting onChange event.
	//
	
	// game.settings.register(RNCS.ID, "version", {...}); listens for this onChange
	if (old_version !== module_version) {
		await game.settings.set(RNCS.ID, "version", module_version);
		console.log("RNCS | game.setting new version:" + game.settings.get(RNCS.ID, "version"));
	}
}

export class RNCS {
	static ID = 'roll-new-character-stats';

	// Restores default settings
	static async restoreDefaultSettings() {
		if (!game.user.isGM) return;
		const rncs_settings = Array.from(game.settings["settings"]).filter(x => x[1].namespace === RNCS.ID 
																			 && x[1].key !== "version");
		for (const setting of rncs_settings) {
			console.log("RNCS | Restoring " + setting[1].key + " to default setting value " + setting[1].default);
			await game.settings.set(RNCS.ID, setting[1].key);
		}
	}
}

function RemoveButton(msgId) {

	let chatMessage = game.messages?.get(msgId);
	if (!chatMessage)
		return;
	let content = chatMessage && duplicate(chatMessage.content);
	const configure_actor_button = /<button data-action="configure_new_actor">[^<]*<\/button>/;
	content = content?.replace(configure_actor_button, "");
	chatMessage.update({ content });
}

async function FormApp_ConfigureActor(target, 
									  msgId, 
									  owner_id, 
									  final_results, 
									  bonus_points, 
									  other_properties_results, 
									  individual_rolls, 
									  Over18Allowed,
									  HideResultsZone,
									  DistributionMethod) {

	const _settings = new RegisteredSettings;	

	// remove button? if not, don't disable either.
	if (_settings.ChatRemoveConfigureActorButton) { RemoveButton(msgId); } else { target.disabled = false; }

	new ConfigureActor(owner_id, 
					   final_results, 
					   bonus_points, 
					   other_properties_results, 
					   individual_rolls, 
					   Over18Allowed, 
					   DistributionMethod, 
					   HideResultsZone).render(true);

}

String.prototype.format = function () {
	// store arguments in an array
	var args = arguments;
	// use replace to iterate over the string
	// select the match and check if related argument is present
	// if yes, replace the match with the argument
	return this.replace(/{([0-9]+)}/g, function (match, index) {
	  // check if the argument is present
	  return typeof args[index] == 'undefined' ? match : args[index];
	});
  };

export async function RollStats() {	

	// release all tokens first so it does not look like a character or NPC rolled.
	canvas.tokens.releaseAll()

	// Roll them dice!
	const _settings = new RegisteredSettings;
	let dice_roller = new DiceRoller();	

	let question = game.i18n.localize("RNCS.dialog.confirm-roll.Content").toString().format(_settings.NumberOfActors,(_settings.NumberOfActors === 1 ? "character" : "characters"));

    const confirmed = await Dialog.confirm({
		title: game.i18n.localize("RNCS.dialog.confirm-roll.Title"),
		content: "<small>" + dice_roller.GetMethodText() + "<p>" + question + "</p></small>"
	  });

	if (confirmed) {
		for (let _actor = 0; _actor < dice_roller._settingNumberOfActors(); _actor += 1) {

			// Roll abilities
			dice_roller = new DiceRoller()
			await dice_roller.RollThemDice();

			// Show results
			if (_settings.DiceSoNiceEnabled) {
				let data = { throws: [{ dice: dice_roller._roll_data }] };
				await game.dice3d?.show(data)
			}
			ShowResultsInChatMessage(dice_roller);
		}
	}
}

async function ShowResultsInChatMessage(dice_roller) {

	// Create chat message
	const _settings = new RegisteredSettings;
	const speaker = ChatMessage.getSpeaker();
	const owner_id = game.user.id;
	const final_results = dice_roller.GetFinalResults();
	const bonus_points = dice_roller._bonus_point_total;
	const other_properties_results = dice_roller._other_properties_results;
	const individual_rolls = dice_roller.GetIndividualRolls();

	// Pass settings values into message so they persist for this particular roll
	// This is necessary for when the Configure Actor button is not removed, and we want the 
	// the seetings at the time the message was created to still apply to this roll.
	const Over18Allowed = _settings.Over18Allowed;
	const HideResultsZone = (_settings.HideResultsZone && _settings.DistributionMethod !== "distribute-freely") || _settings.DistributionMethod === "ring-method"; // DistributionMethod(1) === Distribute Freely
	const DistributionMethod = _settings.DistributionMethod;

	// Results message header
	let results_message = "<div class=\"dnd5e chat-card\"><header class=\"card-header\"><h3>Rolling New Actor</h3></header>"

	// Add game system other_properties_results description
	if (_settings.ChatShowDescription && other_properties_results.length > 0) {		
		results_message += await dice_roller.GetOPRDescriptionText(final_results, other_properties_results);
	}

	// Add Method to message
	results_message += "<div style=\"font-size: small !important;\">"
	if(_settings.ChatShowMethodText){
		results_message += dice_roller.GetMethodText();
	}

	// Add Dificulty to message
	if(_settings.ChatShowDifficultyText){
		results_message += dice_roller.GetDifficultyDesc();
	}

	// Add Results (Abilitites) to message
	if(_settings.ChatShowResultsText){
		results_message += await dice_roller.GetResultsAbilitiesText();
	}

	// Add total ability score to message
	if(_settings.ChatShowTotalAbilityScore){
		results_message += dice_roller.GetTotalAbilityScore();
	}

	// Add Die Results Set (Abilitites) to message
	if(_settings.ChatShowDieResultSet){
		results_message += await dice_roller.GetDieResultSet();
	}

	// Add Bonus Point(s) to message
	if(_settings.ChatShowBonusPointsText){
		results_message += dice_roller.GetBonusPointsText();
	}

	// Add Note from DM to message
	if(_settings.ChatShowNoteFromDM){
		results_message += dice_roller.GetNoteFromDM();
	}	
	results_message += "</div>"

	// Add Chat Card Button
	switch (game.system.id) {
		case "dnd5e":
		case "pf1":
		case "ose":
		case "archmage":
		case "dcc":
			results_message += "<div class=\"card-buttons rncs-configure-new-actor\"><button data-action=\"configure_new_actor\">";
			results_message += game.i18n.localize("RNCS.dialog.results-button.configure-new-actor");
			results_message += "</button></div></div>"
			break;
		default:
			console.log(RNCS.ID + " | unable to add [" + game.i18n.localize("RNCS.dialog.results-button.configure-new-actor") + "] button to chat card. Game system not supported yet.");
	}

	ChatMessage.create({
		whisper: ChatMessage.getWhisperRecipients("GM"),
		user: owner_id,
		content: results_message,
		speaker: speaker,
		flags: { roll_new_character_stats: {owner_id, 
											final_results, 
											bonus_points, 
											other_properties_results, 
											individual_rolls, 
											Over18Allowed,
											HideResultsZone,
											DistributionMethod
										} }//,   occupation, equipment_list, luck 
	});
}