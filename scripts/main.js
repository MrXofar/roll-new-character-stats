import { registerSettings, settingsKey } from "./settings.js";
import { DiceRoller}  from './dice-roller.js';
import { Controls } from './controls.js';
import { DistributeAbilityScores } from './form-apps/distribute-ability-scores.js';

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
	const msgId = target.closest(".chat-message[data-message-id]")?.dataset.messageId
	const msg = game.messages.get(msgId); 
	const final_results = msg.data.flags.roll_new_character_stats.final_results;
	const bonus_points = msg.data.flags.roll_new_character_stats.bonus_points;
	const over18allowed = msg.data.flags.roll_new_character_stats.over18allowed;
	  if (target.matches(".chat-card button")) FormApp_DistributeAbilityScores(target.dataset.action, final_results, bonus_points, over18allowed, msgId); // removed .dnd5e
	});
  }); 

export class RollNewCharacterStats {
	static ID = 'roll-new-character-stats';
}

export async function RollStats() {	

	// Roll them dice!
	// TODO: Add Race selection to confirmation dialog and pass to chat message (or dice_roller?)
	var dice_roller = new DiceRoller();	
    const confirmed = await Dialog.confirm({
		title: game.i18n.localize("RNCS.dialog.confirm-roll.Title"),
		content: game.i18n.localize("RNCS.dialog.confirm-roll.Method") + "</br>" +
		dice_roller.GetMethodText() + game.i18n.localize("RNCS.dialog.confirm-roll.Content")
	  });

	if (confirmed) {

		// Roll abilities
		dice_roller.RollThemDice("abilities");

		// TODO: Implement dice_roller.RollThemDice("other-properties")
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

	// TODO: Add Results (other-properties) to message

	// Add Note from DM to message
	results_message += dice_roller.GetNoteFromDM();

	// Add Chat Card Button
	switch (game.system.id) {
		case "dnd5e":
			results_message += "<div class=\"card-buttons\"><button data-action=\"";
			results_message += (dice_roller._settingDistributeResults() || dice_roller._settingIsBonusPointApplied() ? "distribute_results" : "accept_new_actor") +"\">"
			results_message += (dice_roller._settingDistributeResults() || dice_roller._settingIsBonusPointApplied() ? game.i18n.localize("RNCS.dialog.results-button.distribute-results") : game.i18n.localize("RNCS.dialog.results-button.accept-new-actor"));
			results_message += "</button></div></div>"
			break;
		default:
			console.log(RollNewCharacterStats.ID + " | unable to add Accept New Character button to chat card. Game system not supported yet.");
	}

	const speaker = ChatMessage.getSpeaker();
	const final_results = dice_roller.GetFinalResults(dice_roller.result_sets);
	const drop_val_index = dice_roller.drop_val_index;
	const bonus_points = dice_roller.bonus_results;
	const over18allowed = dice_roller._settingOver18Allowed();
	ChatMessage.create({
		user: game.user.id,
		content: results_message,
		speaker: speaker,
		flags: { roll_new_character_stats: {final_results, drop_val_index, bonus_points, over18allowed} }
		});
}

/**
 * 
 * @param {String} action - action to take with current results when creating new character
 * @param {Array} final_results - rolled results for abilitites
 * @param {Integer} drop_val_index - index of dropped value
 */
async function FormApp_DistributeAbilityScores(action, final_results, bonus_points, over18allowed, msgId) {

	//Update character abilitites with results
	if (action === "accept_new_actor") {
		// Create new actor
		let actor = await Actor.create({
			name: "New Actor",
			type: "character",
			img: "icons/svg/mystery-man.svg"
		});
		// TODO: Distribute bonus points when allowed with this mode
		UpdateAbilities(actor, final_results);
	}
	else {
		// Show ability score distribution form
		// Reorder final_results based on selections
		//UpdateAbilities(actor, final_results, -1);
		new DistributeAbilityScores(final_results, bonus_points, over18allowed, msgId).render(true);
	}	

	// TODO: UpdateActor with (other-properties) from results_
}

/**
 * 
 * @param {Actor} actor - new actor
 * @param {Array} scores - rolled results for abilitites
 * @param {Integer} drop_val_index - index of dropped value
 */
async function UpdateAbilities(actor, scores) {

	console.log("scores[0] = " + scores[0]);
	switch (game.system.id) {
		case "dnd5e":
			// Apply results as rolled
			await actor.update({
				'data.abilities.str.value': scores[0],
				'data.abilities.dex.value': scores[1],
				'data.abilities.con.value': scores[2],
				'data.abilities.int.value': scores[3],
				'data.abilities.wis.value': scores[4],
				'data.abilities.cha.value': scores[5]
			});
			break;
		default:
			console.log(RollNewCharacterStats.ID + " | unable to apply scores to abilitites. Game system not supported yet.");
	}
	console.log("after update STR = " + actor.data.data.abilities.str.value);
}

