import { registerSettings, settingsKey } from "./settings.js";
import { DiceRoller}  from './dice-roller.js';
import { Controls } from './controls.js';
import { DistributeAbilityScores } from './form-apps/distribute-ability-scores.js';
import { abilities } from './character-properties.js';

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

});

Hooks.on('getSceneControlButtons', (controls) => {
	new Controls().initializeControls(controls);
});

Hooks.on("renderChatLog", (app, [html]) => {
	html.addEventListener("click", ({ target }) => {
		const msgId = target.closest(".chat-message[data-message-id]")?.dataset.messageId;
		if (msgId) {
			const msg = game.messages.get(msgId);
			const final_results = msg.data.flags.roll_new_character_stats.final_results;
			const bonus_points = msg.data.flags.roll_new_character_stats.bonus_points;
			const over18allowed = msg.data.flags.roll_new_character_stats.over18allowed;
			const distributeResults = msg.data.flags.roll_new_character_stats.distributeResults
			if (target.matches(".chat-card button")) FormApp_DistributeAbilityScores(abilities, target.dataset.action, final_results, bonus_points, over18allowed, distributeResults, msgId); // removed .dnd5e
		}
	});
}); 

/**
 * 
 * @param {*} abilities 
 * @param {*} action 
 * @param {*} final_results 
 * @param {*} bonus_points 
 * @param {*} over18allowed 
 * @param {*} distributeResults 
 * @param {*} msgId 
 */
async function FormApp_DistributeAbilityScores(abilities, action, final_results, bonus_points, over18allowed, distributeResults, msgId) {

	new DistributeAbilityScores(abilities, final_results, bonus_points, over18allowed, distributeResults, msgId).render(true);

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

		// Roll abilities
		dice_roller.RollThemDice("abilities");

		// TODO-MEDIUM: Implement dice_roller.RollThemDice("other-properties")
		// dice_roller.RollThemDice("other-properties");

		 // Show results
		ShowResultsInChatMessage(dice_roller);
	}
}

function ShowResultsInChatMessage(dice_roller) {

	// Results message header
	var results_message = "<div class=\"dnd5e chat-card\"><header class=\"card-header\"><h3>Rolling New Actor</h3></header>"
	
	// Add Method to message
	results_message += dice_roller.GetMethodText();

	// Add Dificulty to message
	results_message += dice_roller.GetDifficultyDesc();

	// Add Results (Abilitites) to message
	results_message += dice_roller.GetResultsAbilitiesText();

	// Add Bonus Point(s) to message
	results_message += dice_roller.GetBonusPointsText();

	// TODO-MEDIUM: Add Results (other-properties) to message

	// Add Note from DM to message
	results_message += dice_roller.GetNoteFromDM();

	// Add Chat Card Button
	switch (game.system.id) {
		case "dnd5e":
			results_message += "<div class=\"card-buttons\"><button data-action=\"configure_new_actor\">";
			results_message += game.i18n.localize("RNCS.dialog.results-button.configure-new-actor");
			results_message += "</button></div></div>"
			break;
		default:
			console.log(RollNewCharacterStats.ID + " | unable to add Accept New Character button to chat card. Game system not supported yet.");
	}

	const speaker = ChatMessage.getSpeaker();
	const final_results = dice_roller.GetFinalResults(dice_roller.result_sets);
	const drop_val_index = dice_roller.drop_val_index;
	const bonus_points = dice_roller.bonus_results;
	const distributeResults = dice_roller._settingDistributeResults();
	const over18allowed = dice_roller._settingOver18Allowed();
	ChatMessage.create({
		whisper: ChatMessage.getWhisperRecipients("GM"),
		user: game.user.id,
		content: results_message,
		speaker: speaker,
		flags: { roll_new_character_stats: { final_results, drop_val_index, bonus_points, over18allowed, distributeResults } }
	});
}