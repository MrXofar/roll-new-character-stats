import { registerSettings, settingsKey } from "./settings.js";
import { DiceRoller}  from './dice-roller.js';
import { Controls } from './controls.js';
import { attributes } from './character-properties.js';

Hooks.once("init", () => {
	console.log(RollNewCharacterStats.ID + " | Initialized")
	registerSettings();
});

Hooks.on('getSceneControlButtons', (controls) => {
	new Controls().initializeControls(controls);
});

export class RollNewCharacterStats {
	static ID = 'RollNewCharacterStats';
}

export async function RollStats() {	

	// Roll them dice!
	var dice_roller = new DiceRoller();	
    const confirmed = await Dialog.confirm({
		title: game.i18n.localize("RNCS.dialog.confirm-roll.Title"),
		content: game.i18n.localize("RNCS.dialog.confirm-roll.Method") + "</br>" +
		dice_roller.ShowMethodText() + "</br></br>" + game.i18n.localize("RNCS.dialog.confirm-roll.Content")
	  });

	  if(confirmed){
		  dice_roller.RollThemDice();
		  ShowResultsInChatMessage(dice_roller);
	  }
}

function ShowResultsInChatMessage(dice_roller) {

	var results_message = "<b>" + game.i18n.localize("RNCS.results-text.methods.label") + ":</b></br>";
	results_message += dice_roller.ShowMethodText() + "</br></br>";

	// Add Dificulty to message
	results_message += "<b>" + game.i18n.localize("RNCS.results-text.difficulty.label") + ":</b> " + dice_roller.GetDifficultyDesc() + "</br></br>";

	// Add results to message
	results_message += "<b>" + game.i18n.localize("RNCS.results-text.results.label") + ":</b></br>";
	var apply_to = "";
	var att_idx = 0;
	for (var set = 0; set < dice_roller.result_sets.length; set++) {
		//console.log(dice_roller.result_sets[set]);
		var d6_results = dice_roller.result_sets[set].dice[0].results.map(function (e) { return e.result; }).join(', ');
		apply_to = !dice_roller.DistributeResults() && dice_roller.drop_val_index !== set ? attributes[att_idx].attribute : "Result #" + (set + 1) + ": ";
		results_message += apply_to;
		results_message += dice_roller.drop_val_index === set ? "Dropped => " : "";
		results_message += dice_roller.result_sets[set].total + " [" + d6_results + "]";
		if (dice_roller.drop_val_index !== set && dice_roller.result_sets[set].total === 18) { results_message += " - Booyah!"; }
		results_message += "<br />";
		if (dice_roller.drop_val_index !== set) { att_idx++; }
	}

	// Add Bonus Point(s) to message
	results_message += (dice_roller.IsBonusPointApplied() ? "</br><b>" + game.i18n.localize("RNCS.results-text.bonus.label") + ":</b> " + dice_roller.bonus_results + "</br></br>" : "</br>");

	// Add Note from DM to message
	// Label
	results_message += "<b>" + game.i18n.localize("RNCS.results-text.note-from-dm.label") + ":</b></br>";
	// Score distribution
	results_message += dice_roller.DistributeResults() ? game.i18n.localize("RNCS.results-text.note-from-dm.distribute-freely") : game.i18n.localize("RNCS.results-text.note-from-dm.apply-as-rolled");
	// Bonus Point distribution - if any
	if (dice_roller.IsBonusPointApplied()) { results_message += game.i18n.localize("RNCS.results-text.note-from-dm.distribute-bonus-points"); }
	// Mention final score limit - if any
	results_message += (dice_roller.Over18Allowed() ? game.i18n.localize("RNCS.results-text.note-from-dm.final-scores-may") : game.i18n.localize("RNCS.results-text.note-from-dm.final-scores-may-not")) + game.i18n.localize("RNCS.results-text.note-from-dm.above-18");
	// Mention bonus points - if any - and any other bonuses
	if (dice_roller.IsBonusPointApplied()) { results_message += game.i18n.localize("RNCS.results-text.note-from-dm.bonus-points"); }
	results_message += game.i18n.localize("RNCS.results-text.note-from-dm.any-bonuses");

	const speaker = ChatMessage.getSpeaker();
	ChatMessage.create({
		user: game.user.id,
		content: results_message,
		speaker: speaker
	}, {});
}

