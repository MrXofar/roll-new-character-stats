import { registerSettings, settingsKey } from "./settings.js";
import Controls from './controls.js';

let namedfields = (...fields) => {
	return (...arr) => {
		var obj = {};
		fields.forEach((field, index) => {
			obj[field] = arr[index];
		});
		return obj;
	};
};

let num_dice = namedfields('formula', 'die', 'difficulty');
let num_roll = namedfields('method', 'rolls', 'difficulty');
let bonus_point = namedfields('method', 'difficulty');
let attribute = namedfields('attribute');

Hooks.once("init", () => {
	console.log(RollNewCharacterStats.ID + " | Initialized")
	registerSettings();
});

/**
 * Handle adding new controls
 */
Hooks.on('getSceneControlButtons', (controls) => {
	new Controls().initializeControls(controls);
});


export class RollNewCharacterStats {
	static ID = 'roll-new-character-stats';
}

export default async function RollStats() {
	
	var num_die = [
		num_dice(game.i18n.localize("RNCS.settings.d6Method.choices.0"), 3, 0),
		num_dice(game.i18n.localize("RNCS.settings.d6Method.choices.1"), 4, 2),
		num_dice(game.i18n.localize("RNCS.settings.d6Method.choices.2"), 2, 3)
	];
	var num_rolls = [
		num_roll(game.i18n.localize("RNCS.settings.NumberOfSetsRolls.choices.0"), 6, 0),
		num_roll(game.i18n.localize("RNCS.settings.NumberOfSetsRolls.choices.1"), 7, 1)
	];
	var bonus_points = [
		bonus_point(game.i18n.localize("RNCS.settings.BonusPoints.choices.0"), 0),
		bonus_point(game.i18n.localize("RNCS.settings.BonusPoints.choices.1"), 1),
		bonus_point(game.i18n.localize("RNCS.settings.BonusPoints.choices.2"), 3)
	];
	var attributes = [
		attribute('STR: '),
		attribute('DEX: '),
		attribute('CON: '),
		attribute('INT: '),
		attribute('WIS: '),
		attribute('CHA: ')
	];

	//console.log("Roll New Character Stats | Attempting to roll new stats!");
	const dice_so_nice = game.modules.get("dice-so-nice")?.active;

	// Number of d6 to roll
	let num_diceIndex = parseInt(game.settings.get(settingsKey, "d6Method")); 
	let die = num_die[num_diceIndex].die;
	let die_difficulty = num_die[num_diceIndex].difficulty;

	// Number of times d6 are rolled
	let num_rollIndex = parseInt(game.settings.get(settingsKey, "NumberOfSetsRolls"));
	let rolls = num_rolls[num_rollIndex].rolls;
	let rolls_difficulty = num_rolls[num_rollIndex].difficulty;

	// Number of Bonus Points to add to final results
	let bonus_Index = parseInt(game.settings.get(settingsKey, "BonusPoints"));
	let bonus_method = bonus_points[bonus_Index].method;
	let bonus_method_difficulty = bonus_points[bonus_Index].difficulty;

	// Other stuff (from the check boxes)
	let re_roll_ones = game.settings.get(settingsKey, "ReRollOnes");
	let over_eighteen = game.settings.get(settingsKey, "Over18Allowed");
	let distribute_results = game.settings.get(settingsKey, "DistributeResults");

	// Roll them dice!
	var result_sets = [];
	var num_sets = rolls;
	var roll_formula = die + "d6" + (re_roll_ones ? "rr1" : "") + (num_diceIndex === 1 ? "dl" : "") //num_diceIndex === 1 === "4d6 - Drop lowest"
	roll_formula += die === 2 ? "+6" : "";// 2d6+6 method
	//console.log("roll_formula = " + roll_formula);
	for (var rs = 0; rs < num_sets; rs++) {
		var roll = await new Roll(roll_formula);
		var rolled_results = await roll.evaluate({ async: false });
		if (dice_so_nice) { game.dice3d.showForRoll(roll); }
		//var d6_results = rolled_results.dice[0].results.map(function (e) {return e.result;}).join(', ');    
		//console.log(rolled_results.total + " = [" + d6_results + "]");
		result_sets.push(rolled_results)
		//console.log(result_sets[rs]);
	}

	// Drop lowest
	var drop_val_idx = -1;
	if (num_rollIndex === 1) { //"7 Rolls - Drop lowest"
		var results = result_sets.map(function (e) { return e.total; }).join(',').split(',').map(Number);
		var drop_val = Math.min(...results);
		drop_val_idx = results.indexOf(drop_val);
	}

	// Bonus Points
	var bonus_roll;
	switch (bonus_Index) {
		case 0://"0 Bonus Points":
			bonus_roll = 0
			break;
		case 1://"1 Bonus Point":
			bonus_roll = 1
			break;
		case 2://"1d4 Bonus Points":
			var bonus = await new Roll("1d4");
			bonus_roll = await bonus.evaluate({ async: false }).total;
			if (dice_so_nice) { game.dice3d.showForRoll(bonus); }
			break;
		default:
	}

	// Get difficulty level		
	var difficulty = die_difficulty + rolls_difficulty + bonus_method_difficulty;
	difficulty += re_roll_ones ? 3 : 0;
	difficulty += over_eighteen ? 2 : 0;
	difficulty += distribute_results ? 3 : 0;

	var difficulty_desc;
	// There are so many other ways to skin this cat,... 
	// ...but I chose this way because it requires very little effort or brain power to understand or modify.
	switch (difficulty) {
		case 0:
			difficulty_desc = game.i18n.localize("RNCS.results-text.difficulty.level.Hardcore");
			break;
		case 1:
		case 2:
		case 3:
			difficulty_desc = game.i18n.localize("RNCS.results-text.difficulty.level.Veteran");
			break;
		case 4:
		case 5:
		case 6:
		case 7:
		case 8:
			difficulty_desc = game.i18n.localize("RNCS.results-text.difficulty.level.EasyDay");
			break;
		case 9:
		case 10:
		case 11:
		case 12:
		case 13:
		case 14:
		case 15:
			difficulty_desc = game.i18n.localize("RNCS.results-text.difficulty.level.Yawn");
			break;
	}

	// Begin building message
	var results_message = "<b>" + game.i18n.localize("RNCS.results-text.methods.label") + ":</b></br>";
	results_message += num_die[num_diceIndex].formula + (re_roll_ones ? game.i18n.localize("RNCS.results-text.methods.but-re-roll-ones") : "") + "</br>";
	results_message += num_rolls[num_rollIndex].method + "</br>";
	results_message += bonus_Index > 0 ? "+" + bonus_method + "</br>" : "";
	results_message += (over_eighteen ? game.i18n.localize("RNCS.results-text.methods.over-18-allowed") : game.i18n.localize("RNCS.results-text.methods.over-18-not-allowed")) + "</br>";
	results_message += (distribute_results ? game.i18n.localize("RNCS.results-text.methods.distribute-freely") : game.i18n.localize("RNCS.results-text.methods.apply-as-rolled")) + "</br></br>";
	
	// Add Dificulty to message
	results_message += "<b>" + game.i18n.localize("RNCS.results-text.difficulty.label") + ":</b> " + difficulty_desc + "</br></br>";
	
	// Add results to message
	results_message += "<b>" + game.i18n.localize("RNCS.results-text.results.label") + ":</b></br>";
	var apply_to = "";
	var att_idx = 0;
	for (var set = 0; set < result_sets.length; set++) {
		//console.log(result_sets[set]);
		var d6_results = result_sets[set].dice[0].results.map(function (e) { return e.result; }).join(', ');
		apply_to = !distribute_results && drop_val_idx !== set ? attributes[att_idx].attribute : "Result #" + (set + 1) + ": "
		results_message += apply_to;
		results_message += drop_val_idx === set ? "Dropped => " : "";
		results_message += result_sets[set].total + " [" + d6_results + "]";
		if (drop_val_idx !== set && result_sets[set].total === 18) { results_message += " - Booyah!"; }
		results_message += "<br />";
		if (drop_val_idx !== set) { att_idx++; }
	}

	// Add Bonus Point(s) to message
	results_message += (bonus_Index > 0 ? "</br><b>" + game.i18n.localize("RNCS.results-text.bonus.label") + ":</b> " + bonus_roll + "</br></br>" : "</br>");

	// Add Note from DM to message
	// Label
	results_message += "<b>" + game.i18n.localize("RNCS.results-text.note-from-dm.label") + ":</b></br>";
	// Score distribution
	results_message += distribute_results ? game.i18n.localize("RNCS.results-text.note-from-dm.distribute-freely") : game.i18n.localize("RNCS.results-text.note-from-dm.apply-as-rolled");
	// Bonus Point distribution - if any
	if (bonus_Index > 0) { results_message += game.i18n.localize("RNCS.results-text.note-from-dm.distribute-bonus-points"); }
	// Mention final score limit - if any
	results_message += (over_eighteen ? game.i18n.localize("RNCS.results-text.note-from-dm.final-scores-may") : game.i18n.localize("RNCS.results-text.note-from-dm.final-scores-may-not")) + game.i18n.localize("RNCS.results-text.note-from-dm.above-18");
	// Mention bonus points - if any - and any other bonuses
	if (bonus_Index > 0) { results_message += game.i18n.localize("RNCS.results-text.note-from-dm.bonus-points"); }
	results_message += game.i18n.localize("RNCS.results-text.note-from-dm.any-bonuses");

	const speaker = ChatMessage.getSpeaker();
	ChatMessage.create({
		user: game.user.id,
		content: results_message,
		speaker: speaker
	}, {});
}
