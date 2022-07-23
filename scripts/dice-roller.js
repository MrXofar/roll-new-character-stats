/**
 * dice-roller is responsible for building the appropriate roll formula 
 * and applying rules to those rolls based on user settings
 * and building the message text to display the results.  
 */

import { RegisteredSettings } from "./registered-settings.js";
import { namedfields } from "./constants.js";
import GAME_SYSTEM_Helper from "../data/game-system-helper.js";
import dcc_ActorHelper from "./helpers/dcc-actor-helper.js";

const num_dice = namedfields('description', 'die', 'difficulty');
const num_roll = namedfields('description', 'roll_count', 'difficulty');
const bonus_points = namedfields('description', 'difficulty');

export class DiceRoller {
    _settings = new RegisteredSettings;
    _other_properties_results = [];

    constructor(
        results_abilities = [], // Results of dice rolled for abilities
        drop_val_index = -1,    // Index of roll to be displayed as "Dropped =>" from [results_abilities] 
        bonus_results = 0,       // Result of RollBonusPoints()
    ) {
        this.results_abilities = results_abilities,
        this.drop_val_index = drop_val_index,
        this.bonus_results = bonus_results
    }

    // Roll Them Dice!
    async RollThemDice() {
        let roll_data = this.RollAbilities();
        // Prepare formula to roll other properties
        let formula = "";
        switch (game.system.id) {
            case "dnd5e":
                break;
            case "pf1":
                break;
            case "ose":
                break;
            case "archmage":
                break;
            case "dcc":
                // Rolls with '?' are conditional. Use result in dcc-actor-handler if condition is met.
                // Example: The result from the 1d8? for farmer type will only be applied if the 1d100 results in a Farmer* occupation.
                // 1d4   => hit points
                // 5d12  => starting money "cp"
                // 1d100 => occupation
                // 1d6?  => missile weapon ammo quantity
                // 1d8?  => farmer type
                // 1d6?  => farm animal (trade good)
                // 1d6?  => cart contents (trade good)
                // 1d24  => equipment
                // 1d30  => luck store
                formula = "1d4/5d12/1d100/1d6/1d8/1d6/1d6/1d24/1d30";
                break;
        }
        let add_roll_data = [];
        if(formula !== ""){
            add_roll_data = await this.RollOtherProperties(formula);
        }
        return roll_data.concat(add_roll_data);
    }

    Formula_Abilities() {

        let formula = this._settingAbilitiesRollMethodNumDie();
        formula += "d6"; // TODO-LOW: Add AbilitiesRollMethodNumFaces() setting to roll different sided die
        formula += (this._settings.ReRollOnes ? "rr1" : "");
        formula += (this._settings.DropLowestDieRoll ? "dl" : "") 
        formula += this._settingAbilitiesRollMethodNumDie() === 2 ? "+6" : ""; // TODO-LOW: Add AbilitiesRollMethodDieMod() to add modifier to rolls
        return formula;
    }

    RollAbilities(){
        // Ability Rolls
        let roll_data = [];
        for (let rs = 0; rs < this._settingNumberOfRollsCount(); rs++) {
            const roll = new Roll(this.Formula_Abilities());
            const rolled_results = roll.evaluate({ async: false });
            this.results_abilities.push(rolled_results)

            //Get roll data
            if (this._settings.DiceSoNiceEnabled) {
                for (let i = 0; i < rolled_results.dice[0].results.length; i += 1) {
                    roll_data.push({
                        result: rolled_results.dice[0].results[i].result,
                        resultLabel: rolled_results.dice[0].results[i].result,
                        type: "d6",
                        vectors: [],
                        options: {}
                    });
                }
            }
        }


        // Drop Lowest Set
        if (this._settings.DropLowestSet) {
            const results = this.results_abilities.map(function (e) { return e.total; }).join(',').split(',').map(Number);
            const drop_val = Math.min(...results);
            this.drop_val_index = results.indexOf(drop_val);
        }

        // Bonus Points
        switch (parseInt(this._settings.BonusPoints)) {
            case 0: //"0 Bonus Points":
                this.bonus_results = 0;
                break;
            case 1: //"1 Bonus Point":
                this.bonus_results = 1;
                break;
            case 2: //"1d4 Bonus Points":
                const bonus = new Roll("1d4");
                this.bonus_results = bonus.evaluate({ async: false }).total;
                if (this._settings.DiceSoNiceEnabled) {
                    roll_data.push({
                        result: this.bonus_results,
                        resultLabel: this.bonus_results,
                        type: "d4",
                        vectors: [],
                        options: {}
                    });
                }

                break;
            default:
        }
        // console.log(roll_data);
        return roll_data;
    }

    async RollOtherProperties(formula) {
        let roll_data = [];
        const roll = await new Roll(formula);
        const rolled_results = await roll.evaluate({ async: false });

        for (let i = 0; i < rolled_results.dice.length; i += 1) {
            this._other_properties_results.push(rolled_results.dice[i].total);

            // Get roll data
            if (this._settings.DiceSoNiceEnabled) {
                for (let j = 0; j < rolled_results.dice[i].results.length; j += 1) {
                    let _result = rolled_results.dice[i].results[j].result;
                    if (rolled_results.dice[i].faces !== 100) {
                        roll_data.push({
                            result: _result,
                            resultLabel: _result,
                            type: "d" + rolled_results.dice[i].faces,
                            vectors: [],
                            options: {}
                        });
                    } else {// Deal with d100: Seriously??? Surely this can be simplified
                        roll_data.push({
                            resultLabel: _result.toString().substring(0, 1) + "0",
                            d100Result: _result,
                            result: _result.toString().substring(0, 1),
                            type: "d100",
                            vectors: [],
                            options: {}
                        });
                        if (parseInt(_result) >= 10) {
                            roll_data.push({
                                resultLabel: _result.toString().substring(1, 2),
                                d100Result: _result,
                                result: _result.toString().substring(1, 2),
                                type: "d10",
                                vectors: [],
                                options: {}
                            });
                        }
                    }
                }
            }
        }
        return roll_data;
    }

    GetFinalResults() {
        // Get ability scores from results_abilities[] and ignore dropped val if one exists
        let _ability_scores = [];
        this.results_abilities.forEach(score => {
            const score_index = this.results_abilities.indexOf(score);
            if (score_index !== this.drop_val_index) {
                _ability_scores.push(this.results_abilities[score_index].total);
            }
        });
        return _ability_scores;
    }

    NumberOfActors() {
        return parseInt(this._settings.NumberOfActors);
    }
    
    // Roll method details for Abilities (3d6, 4d6, 2d6+6, etc...)
    AbilitiesRollMethod() {
        return [
            num_dice(game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.0"), 3, 0),
            num_dice(game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.1"), 4, 1),
            num_dice(game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices.2"), 2, 2)
        ];
    }
    AbilitiesRollMethodDesc() {
        return this.AbilitiesRollMethod()[parseInt(this._settings.AbilitiesRollMethod)].description;
    }
    _settingAbilitiesRollMethodNumDie() {
        return this.AbilitiesRollMethod()[parseInt(this._settings.AbilitiesRollMethod)].die;
    }
    AbilitiesRollMethodDifficulty() {
        return this.AbilitiesRollMethod()[parseInt(this._settings.AbilitiesRollMethod)].difficulty;
    }

    // Number of rolls details for Abilities (6 Sets, 7 Sets, etc...)
    NumberOfRolls() {
        return [
            num_roll(game.i18n.localize("RNCS.settings.NumberOfRolls.choices.0"), 6, 0),
            num_roll(game.i18n.localize("RNCS.settings.NumberOfRolls.choices.1"), 7, 1)
        ];
    }
    NumberOfRollsDesc() {
        return this.NumberOfRolls()[parseInt(this._settings.NumberOfRolls)].description;
    }
    _settingNumberOfRollsCount() {
        return this.NumberOfRolls()[parseInt(this._settings.NumberOfRolls)].roll_count;
    }
    NumberOfRollsDifficulty() {
        return this.NumberOfRolls()[parseInt(this._settings.NumberOfRolls)].difficulty;
    }

    // Bonus Point details
    BonusPoints() {
        return [
            bonus_points(game.i18n.localize("RNCS.settings.BonusPoints.choices.0"), 0),
            bonus_points(game.i18n.localize("RNCS.settings.BonusPoints.choices.1"), 1),
            bonus_points(game.i18n.localize("RNCS.settings.BonusPoints.choices.2"), 3)
        ];
    }
    BonusPointsDesc() {
        return this.BonusPoints()[parseInt(this._settings.BonusPoints)].description;
    }
    BonusPointsDifficulty() {
        return this.BonusPoints()[parseInt(this._settings.BonusPoints)].difficulty;
    }
    _settingIsBonusPointApplied() {
        return parseInt(this._settings.BonusPoints) > 0;
    }

    // Get Other Properties Results description
    async GetOPRDescriptionText(final_results, other_properties_results){
        let description_text = "<div style=\"font-size: 0.75em;\">"
		let description = "";
		switch (game.system.id) {
			case "dnd5e":
			case "pf1":
			case "ose":
			case "archmage":
				break;
			case "dcc":
				let dcc_actor_helper = new dcc_ActorHelper(null, other_properties_results);

				// Roll/Set common properties
				dcc_actor_helper._RollBaseHitPoints();
				dcc_actor_helper._hp_modifier_ability;
				dcc_actor_helper._RollStartingMoney();

				// Roll/Set system unique properties
				dcc_actor_helper.stamina_modifier = CONFIG.DCC.abilities.modifiers[final_results[2]];// Stamina Modifier
				dcc_actor_helper.luck_modifier = CONFIG.DCC.abilities.modifiers[final_results[5]];// Luck Modifier
				await dcc_actor_helper.RollOccupation();    // No return value - set internal to dcc_actor_helper.occupation
				await dcc_actor_helper.RollEquipment();     // No return value - set internal to dcc_actor_helper.
				await dcc_actor_helper.RollLuck();          // No return value - set internal to dcc_actor_helper.

				// Build description
				description = dcc_actor_helper.BuildDescription();
				break;
		}
		description_text += description;
		description_text += "</div>";
        return description_text;
    }

    // Get results text
    GetMethodText() {
        let method_text = "<p><b>" + game.i18n.localize("RNCS.results-text.methods.label") + ":</b></br>";
        method_text += "<em>" + game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices." + this._settings.AbilitiesRollMethod);
        method_text += (this._settings.DropLowestDieRoll ? game.i18n.localize("RNCS.results-text.methods.drop-lowest-die") : "");
        method_text += (this._settings.ReRollOnes ? game.i18n.localize("RNCS.results-text.methods.re-roll-ones") : "") + "</br>";
        method_text += game.i18n.localize("RNCS.settings.NumberOfRolls.choices." + this._settings.NumberOfRolls);
        method_text += (this._settings.DropLowestSet ? game.i18n.localize("RNCS.results-text.methods.drop-lowest-set") : "") + "</br>";
        method_text += (this._settings.BonusPoints > 0 ? "+" + game.i18n.localize("RNCS.settings.BonusPoints.choices." + this._settings.BonusPoints) + "</br>" : "");
        if(!this._settings.Over18Allowed && (this._settings.DistributeResults || this._settings.BonusPoints > 0))
        {
            method_text += game.i18n.localize("RNCS.results-text.methods.over-18-not-allowed") + "</br>"
        }
        method_text += (this._settings.DistributeResults ? game.i18n.localize("RNCS.results-text.methods.distribute-freely") : game.i18n.localize("RNCS.results-text.methods.apply-as-rolled")) + "</em>"
        method_text += "</p>"
        return method_text;
    }
    GetDifficultyDesc() {

        let difficulty = 0;
        
        // Drop down selections with namedfields
        difficulty += this.AbilitiesRollMethodDifficulty();
        difficulty += this.NumberOfRollsDifficulty();
        difficulty += this.BonusPointsDifficulty();

        // Check Box selections
        difficulty += this._settings.ReRollOnes ? 3 : 0;
        difficulty += this._settings.DropLowestDieRoll ? 1 : 0;
        difficulty += this._settings.DropLowestSet ? 1 : 0;
        difficulty += this._settings.Over18Allowed ? 2 : 0;
        difficulty += this._settings.DistributeResults ? 3 : 0;

        let difficulty_desc = "<p><b>" + game.i18n.localize("RNCS.results-text.difficulty.label") + ":</b> ";
        // There are so many other ways to skin this cat,... 
        // ...but I chose this way because it requires very little effort or brain power to understand or modify.
        switch (difficulty) {
            case 0:
                difficulty_desc += game.i18n.localize("RNCS.results-text.difficulty.level.Hardcore");
                break;
            case 1:
            case 2:
            case 3:
                difficulty_desc += game.i18n.localize("RNCS.results-text.difficulty.level.Veteran");
                break;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                difficulty_desc += game.i18n.localize("RNCS.results-text.difficulty.level.EasyDay");
                break;
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
                difficulty_desc += game.i18n.localize("RNCS.results-text.difficulty.level.Yawn");
                break;
            default:
                difficulty_desc += "I really don't know";

        }
        difficulty_desc += "</p>"
        return difficulty_desc;
    }

    async GetResultsAbilitiesText() {
        // Abilities
        const system_helper = new GAME_SYSTEM_Helper();
        const abilities = await system_helper.getSystemAbilities();
        let results_text = "<b>" + game.i18n.localize("RNCS.results-text.results.label") + ":</b> " + game.i18n.localize("RNCS.results-text.results.abilities") + "</br>";
        let apply_to = "";
        let att_idx = 0;
        let d6_results = []

        // NOTE: If more rolls than needed to fill abilities is selected, and Distrubute results is unchecked without selecting Drop Lowest Set,
        // the last roll will still be displayed, but not applied to any ability. 
        // This might look confusing to players - so maybe a way to indicate this in the chat message??
        if (this._settings.ChatShowCondensedResults) { 
            // Condensed
            results_text += "<table><tr>";
            for (let set = 0; set < this.results_abilities.length; set++) {
                d6_results = this.results_abilities[set].dice[0].results.map(function (e) { return e.result; }).join(', ');
                apply_to = (att_idx < abilities.length && !this._settings.DistributeResults && this.drop_val_index !== set ? abilities[att_idx] : "R" + (set + 1));
                results_text += "<td style=\"text-align: center;\">";
                results_text += "<label class=\"ability-text\">" + (this.drop_val_index === set ? "X" : apply_to) + "</label><br>";
                results_text += this.results_abilities[set].total
                results_text += "</td>";
                if (this.drop_val_index !== set) { att_idx++; }
            }
            results_text += "</tr></table>";
        }
        else {
            // Detailed rolls
            for (let set = 0; set < this.results_abilities.length; set++) {
                d6_results = this.results_abilities[set].dice[0].results.map(function (e) { return e.result; }).join(', ');
                apply_to = att_idx < abilities.length && !this._settings.DistributeResults && this.drop_val_index !== set ? "<label class=\"ability-text\">" + abilities[att_idx] + "</label>: " : "";
                results_text += apply_to;
                results_text += this.drop_val_index === set ? "Dropped => " : "";
                results_text += this.results_abilities[set].total + " [" + d6_results + "]";
                if (this.drop_val_index !== set && this.results_abilities[set].total === 18) { results_text += " - Booyah!"; }
                if (set < this.results_abilities.length - 1) { results_text += "<br />"; }
                if (this.drop_val_index !== set) { att_idx++; }
            }
        }
        return results_text;
    }

    GetBonusPointsText(){
        return (this._settingIsBonusPointApplied() ? "<p><b>" + game.i18n.localize("RNCS.results-text.bonus.label") + ":</b> " + this.bonus_results + "</p>" : "</br>");
    }

    GetNoteFromDM(){
        let note_from_dm = "<b>" + game.i18n.localize("RNCS.results-text.note-from-dm.label") + ":</b></br>";
        // Score distribution
        note_from_dm += "<em>" + (this._settings.DistributeResults ? game.i18n.localize("RNCS.results-text.note-from-dm.distribute-freely") : game.i18n.localize("RNCS.results-text.note-from-dm.apply-as-rolled"));
        // Bonus Point distribution - if any
        if (this._settingIsBonusPointApplied()) { note_from_dm += game.i18n.localize("RNCS.results-text.note-from-dm.distribute-bonus-points"); }

        // Mention final score limit - if any
        if(!this._settings.Over18Allowed && (this._settings.DistributeResults || this._settingIsBonusPointApplied()))
        {
            note_from_dm += (this._settings.Over18Allowed ? game.i18n.localize("RNCS.results-text.note-from-dm.final-scores-may") : game.i18n.localize("RNCS.results-text.note-from-dm.final-scores-may-not")) + game.i18n.localize("RNCS.results-text.note-from-dm.above-18");
            // Mention bonus points - if any - and any other bonuses
            if (this._settingIsBonusPointApplied()) { note_from_dm += game.i18n.localize("RNCS.results-text.note-from-dm.bonus-points"); }
            note_from_dm += game.i18n.localize("RNCS.results-text.note-from-dm.any-bonuses") + "</em>";
        }

        return "<p>" + note_from_dm + "</p>";
    }
}