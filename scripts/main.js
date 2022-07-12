import { registerSettings, settingsKey } from "./settings.js";
import { DiceRoller}  from './dice-roller.js';
import { Controls } from './controls.js';
import { DistributeAbilityScores } from './form-apps/distribute-ability-scores.js';
// import { abilities } from './character-properties.js';

Hooks.once("init", () => {
	console.log(RollNewCharacterStats.ID + " | Initialized")
	registerSettings();

	// Register Handlebars helpers
	Handlebars.registerHelper("add", function (a, b) {
		return a + b;
	});
	Handlebars.registerHelper("for", function (from, to, incr, block) {
		var accum = '';
		for (var i = from; i < to; i += incr)
			accum += block.fn(i);
		return accum;
	});
	// I know there is a more robust option out there for handlebars logic, 
	// but this will suffice for the only spot I need OR logic at the moment
	Handlebars.registerHelper("if_AorB", function (a, b, options) {
		if (a || b){return options.fn(this);}else{options.inverse(this);}
	});

});

Hooks.on('getSceneControlButtons', (controls) => {
	new Controls().initializeControls(controls);
});

Hooks.on("renderChatLog", (app, [html]) => {
	html.addEventListener("click", ({ target }) => {
		const msgId = target.closest(".chat-message[data-message-id]")?.dataset.messageId;
		if (msgId && target.matches(".chat-card button") && target.dataset.action === "configure_new_actor") {
			const msg = game.messages.get(msgId);
			const owner_id = msg.data.flags.roll_new_character_stats.owner_id;
			const final_results = msg.data.flags.roll_new_character_stats.final_results;
			const bonus_points = msg.data.flags.roll_new_character_stats.bonus_points;
			const distributeResults = msg.data.flags.roll_new_character_stats.distributeResults
			const over18allowed = msg.data.flags.roll_new_character_stats.over18allowed || (bonus_points === 0 && !distributeResults);  
			const occupation = msg.data.flags.roll_new_character_stats.occupation
			const equipment_list = msg.data.flags.roll_new_character_stats.equipment_list
			const luck = msg.data.flags.roll_new_character_stats.luck
			FormApp_DistributeAbilityScores(target, owner_id, final_results, bonus_points, over18allowed, distributeResults, msgId, occupation, equipment_list, luck);
		}
	});
}); 

/**
 * 
 * @param {*} button 
 * @param {*} final_results 
 * @param {*} bonus_points 
 * @param {*} over18allowed 
 * @param {*} distributeResults 
 * @param {*} msgId 
 */
async function FormApp_DistributeAbilityScores(button, owner_id, final_results, bonus_points, over18allowed, distributeResults, msgId, occupation, equipment_list, luck) {
	button.disabled = false; // Keep Configure Actor button enabled
	new DistributeAbilityScores(owner_id, final_results, bonus_points, over18allowed, distributeResults, msgId, occupation, equipment_list, luck).render(true);

// TODO-MEDIUM: UpdateActor with (other-properties) from results_

}

export class RollNewCharacterStats {
	static ID = 'roll-new-character-stats';
}

export async function RollStats() {	

	// Roll them dice!
	var dice_roller = new DiceRoller();	
    const confirmed = await Dialog.confirm({
		title: game.i18n.localize("RNCS.dialog.confirm-roll.Title"),
		content: "<small>" + dice_roller.GetMethodText() + game.i18n.localize("RNCS.dialog.confirm-roll.Content") + "</small>"
	  });

	if (confirmed) {

		for (var _actor = 0; _actor < dice_roller.NumberOfActors(); _actor += 1) {
			// Roll abilities
			dice_roller = new DiceRoller()
			await dice_roller.RollThemDice("abilities");

			if (game.system.id === "dcc") {
				// Roll Equipment, Occupation and Luck
				await dice_roller.RollThemDice("occupation");
				await dice_roller.RollThemDice("equipment");
				await dice_roller.RollThemDice("luck");
			}

			// TODO-MEDIUM: Implement dice_roller.RollThemDice("other-properties")

			// Show results
			ShowResultsInChatMessage(dice_roller);
		}
	}
}

async function ShowResultsInChatMessage(dice_roller) {

	// Results message header
	var results_message = "<div class=\"dnd5e chat-card\"><header class=\"card-header\"><h3>Rolling New Actor</h3></header>"
	
	// Dungeon Crawler Classics stuff
	if (game.system.id === "dcc") {
		// Display equipment
		results_message += "<div style=\"font-size: small !important;\">"
		results_message += dice_roller.occupation;
		for (var i = 0; i < dice_roller.equipment.length; i += 1) {
			results_message += dice_roller.equipment[i] + "<br>";
		}
		results_message += dice_roller.luck + "<br>";
		results_message += "</div>"
	}
	
	// Add Method to message
	
	results_message += "<div style=\"font-size: small !important;\">"
	if(game.settings.get(settingsKey, "ChatShowMethodText")){
		results_message += dice_roller.GetMethodText();
	}

	// Add Dificulty to message
	if(game.settings.get(settingsKey, "ChatShowDifficultyText")){
		results_message += dice_roller.GetDifficultyDesc();
	}

	// Add Results (Abilitites) to message
	if(game.settings.get(settingsKey, "ChatShowResultsText")){
		results_message += await dice_roller.GetResultsAbilitiesText();
	}

	// Add Bonus Point(s) to message
	if(game.settings.get(settingsKey, "ChatShowBonusPointsText")){
		results_message += dice_roller.GetBonusPointsText();
	}

// TODO-MEDIUM: Add Results (other-properties) to message

	// Add Note from DM to message
	if(game.settings.get(settingsKey, "ChatShowNoteFromDM")){
		results_message += dice_roller.GetNoteFromDM();
	}
	
	results_message += "<div style=\"font-size: small !important;\">"


	// Add Chat Card Button
	switch (game.system.id) {
		case "dnd5e":
		case "pf1":
		case "ose":
		case "archmage":
		case "dcc": 
			results_message += "<div class=\"card-buttons\"><button data-action=\"configure_new_actor\">";
			results_message += game.i18n.localize("RNCS.dialog.results-button.configure-new-actor");
			results_message += "</button></div></div>"
			break;
		default:
			console.log(RollNewCharacterStats.ID + " | unable to add [" + game.i18n.localize("RNCS.dialog.results-button.configure-new-actor") + "] button to chat card. Game system not supported yet.");
	}

	const speaker = ChatMessage.getSpeaker();
	const final_results = dice_roller.GetFinalResults(dice_roller.result_sets);
	const drop_val_index = dice_roller.drop_val_index;
	const bonus_points = dice_roller.bonus_results;
	const distributeResults = dice_roller._settingDistributeResults();
	const over18allowed = dice_roller._settingOver18Allowed();
	const occupation = dice_roller.occupation;
	const equipment_list = dice_roller.equipment;
	const luck = dice_roller.luck;
	const owner_id = game.user.id;
	ChatMessage.create({
		whisper: ChatMessage.getWhisperRecipients("GM"),
		user: owner_id,
		content: results_message,
		speaker: speaker,
		flags: { roll_new_character_stats: {owner_id, final_results, drop_val_index, bonus_points, over18allowed, distributeResults, occupation, equipment_list, luck } }
	});
}