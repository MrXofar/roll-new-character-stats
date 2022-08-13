/**
 * dice-roller is responsible for building the appropriate roll formula 
 * and applying rules to those rolls based on user settings
 * and building the message text to display the results.  
 */

import { RegisteredSettings } from "./registered-settings.js";
import GAME_SYSTEM_Helper from "../data/game-system-helper.js";
import dcc_ActorHelper from "./helpers/dcc-actor-helper.js";

export class DiceRoller {

    _settings = new RegisteredSettings;
    _other_properties_results = [];
    _roll_data = [];
    _bonus_point_total = 0;

    constructor(
        results_abilities = [], // Results of dice rolled for abilities
        drop_val_index = -1,    // Index of roll to be displayed as "Dropped =>" from [results_abilities] 
    ) {
        this.results_abilities = results_abilities,
        this.drop_val_index = drop_val_index
    }

    // Roll Them Dice!
    async RollThemDice() {
        this.RollAbilities();    
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
        if(formula !== ""){
            this.RollOtherProperties(formula);
        }
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
        for (let rs = 0; rs < this._settingNumberOfSetsRolledCount(); rs++) {
            const roll = new Roll(this.Formula_Abilities());
            const rolled_results = roll.evaluate({ async: false });
            this.results_abilities.push(rolled_results)

            //Get roll data
            this.GetRollData(rolled_results, 0);
        }

        // Get index of lowest Set to drop
        if (this._settings.DropLowestSet) {
            const results = this.results_abilities.map(function (e) { return e.total; }).join(',').split(',').map(Number);
            const drop_val = Math.min(...results);
            this.drop_val_index = results.indexOf(drop_val);
        }

        // Bonus Points
        switch (this._settings.BonusPoints) {
            case "zero-points":
                this._bonus_point_total = 0;
                break;
            case "one-point":
                this._bonus_point_total = 1;
                break;
            case "one-d-four":
                const bonus = new Roll("1d4");
                const bonus_result = bonus.evaluate({ async: false });
                this._bonus_point_total = bonus_result.total;
                    
                // Get roll data
                this.GetRollData(bonus_result, 0);

                break;
            default:
        }
    }

    async RollOtherProperties(formula) {
        const roll = await new Roll(formula);
        const rolled_results = await roll.evaluate({ async: false });

        for (let index = 0; index < rolled_results.dice.length; index += 1) {
            this._other_properties_results.push(rolled_results.dice[index].total);

            // Get roll data
            this.GetRollData(rolled_results, index);
        }
    }

    GetRollData(rolled_results, index) {
        if (this._settings.DiceSoNiceEnabled) {
            for (let j = 0; j < rolled_results.dice[index].results.length; j += 1) {
                let _result = rolled_results.dice[index].results[j].result;
                if (rolled_results.dice[index].faces !== 100) {
                    this._roll_data.push({
                        result: _result,
                        resultLabel: _result,
                        type: "d" + rolled_results.dice[index].faces,
                        vectors: [],
                        options: {}
                    });
                } else {
                    // Deal with d100: Seriously??? Surely this can be simplified
                    this._roll_data.push({
                        resultLabel: _result.toString().substring(0, 1) + "0",
                        d100Result: _result,
                        result: _result.toString().substring(0, 1),
                        type: "d100",
                        vectors: [],
                        options: {}
                    });
                    if (parseInt(_result) >= 10) {
                        this._roll_data.push({
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

    GetIndividualRolls() {
        // Get individual rolls from results_abilities[] and ignore dropped val if one exists
        let _individual_rolls = [];
        this.results_abilities.forEach(score => {
            const score_index = this.results_abilities.indexOf(score);
            if (score_index !== this.drop_val_index) {
                for(let i = 0; i < this.results_abilities[score_index].dice[0].results.length; i += 1){
                    let result = this.results_abilities[score_index].dice[0].results[i];
                    if(!result.rerolled && !result.discarded){                        
                        _individual_rolls.push(result);
                    }
                }
            }
        });
        return _individual_rolls;
    }

    _settingNumberOfActors() {
        return parseInt(this._settings.NumberOfActors);
    }
    
    _settingAbilitiesRollMethodNumDie() {
        return parseInt(this._settings.AbilitiesRollMethod);
    }

    _settingNumberOfSetsRolledCount() {
        return parseInt(this._settings.NumberOfSetsRolled);
    }

    _settingIsBonusPointApplied() {
        return this._settings.BonusPoints !== "zero-points";
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
        method_text += game.i18n.localize("RNCS.settings.NumberOfSetsRolled.choices." + this._settings.NumberOfSetsRolled);
        method_text += (this._settings.DropLowestSet ? game.i18n.localize("RNCS.results-text.methods.drop-lowest-set") : "") + "</br>";
        method_text += (this._settingIsBonusPointApplied() ? "+" + game.i18n.localize("RNCS.settings.BonusPoints.choices." + this._settings.BonusPoints) + "</br>" : "");        
        if(!this._settings.Over18Allowed && (this._settings.DistributionMethod !== "apply-as-rolled" || this._settingIsBonusPointApplied() || game.system.id === "dnd5e"))
        {
            method_text += game.i18n.localize("RNCS.results-text.methods.over-18-not-allowed") + "</br>"
        }
        method_text += game.i18n.localize("RNCS.settings.DistributionMethod.choices." + this._settings.DistributionMethod);
        method_text += "</p>"
        return method_text;
    }
    GetDifficultyDesc() {

        // AbilitiesRollMethod
        let difficulty = 0;
        difficulty += this._settings.AbilitiesRollMethod === "3" ? 0 : 0;
        difficulty += this._settings.AbilitiesRollMethod === "4" ? 1 : 0;
        difficulty += this._settings.AbilitiesRollMethod === "2" ? 2 : 0;

        // NumberOfSetsRolled
        difficulty += this._settings.NumberOfSetsRolled === "6" ? 0 : 0;
        difficulty += this._settings.NumberOfSetsRolled === "7" ? 1 : 0;
        difficulty += this._settings.NumberOfSetsRolled === "8" ? 2 : 0;
        difficulty += this._settings.NumberOfSetsRolled === "9" ? 3 : 0;

        // BonusPoints
        difficulty += this._settings.BonusPoints === "zero-points" ? 0 : 0;
        difficulty += this._settings.BonusPoints === "one-point" ? 1 : 0;
        difficulty += this._settings.BonusPoints === "one-d-four" ? 3 : 0;

        // DistributionMethod
        difficulty += this._settings.DistributionMethod === "apply as rolled" ? 0 : 0;   
        difficulty += this._settings.DistributionMethod === "distribute-freely" ? 2 : 0;  
        difficulty += this._settings.DistributionMethod === "ring-method" ? 3 : 0;        

        // Check Box selections
        difficulty += this._settings.ReRollOnes ? 3 : 0;
        difficulty += this._settings.DropLowestDieRoll ? 1 : 0;
        difficulty += this._settings.DropLowestSet ? 1 : 0;
        difficulty += this._settings.Over18Allowed ? 2 : 0;

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
            case 16:
            case 17:
            case 18:
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
        let results_text = "<p>";
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
                apply_to = (att_idx < abilities.length && this._settings.DistributionMethod === "apply-as-rolled" && this.drop_val_index !== set ? abilities[att_idx] : "R" + (set + 1));
                results_text += "<td style=\"text-align: center;\">";
                results_text += "<label class=\"rncs-ability-text\">" + (this.drop_val_index === set ? "X" : apply_to) + "</label><br>";
                results_text += this.results_abilities[set].total
                results_text += "</td>";
                if (this.drop_val_index !== set) { att_idx++; }
            }
            results_text += "</tr></table>";
        }
        else {
            // Detailed rolls
            results_text += "<table>";
            results_text += "<th>" + (this._settings.DistributionMethod === "apply-as-rolled" ? "Ability" : "Roll") + "</th>"
            results_text += "<th>" + (this._settings.DistributionMethod === "apply-as-rolled" ? "Score" : "Total") + "</th>"
            results_text += "<th>Die Results</th>"
            for (let set = 0; set < this.results_abilities.length; set++) {
                d6_results = this.results_abilities[set].dice[0].results.map(function (e) { return e.result; }).join(', ');
                apply_to = att_idx < abilities.length && this._settings.DistributionMethod === "apply-as-rolled" && this.drop_val_index !== set ? "<label class=\"rncs-ability-text\">" + abilities[att_idx] + "</label>: " : "R" + (set + 1);
                
                results_text += "<tr>";
                results_text += "<td>" + (this.drop_val_index === set ? "Dropped" : apply_to) + "</td>";
                results_text += "<td>" + this.results_abilities[set].total; 
                if (this.drop_val_index !== set && this.results_abilities[set].total === 18) { results_text += " - Booyah!"; }
                results_text += "</td>";
                results_text += "<td>" + d6_results + "</td>";
                results_text += "</tr>";
                
                if (this.drop_val_index !== set) { att_idx++; }
            }
            results_text += "</table>";
        }
        results_text += "</p>";
        
        return results_text;
    }

    GetDieResultSet() {

        let results_text = "</p>";
        results_text += "<span style=\"font-size: smaller;\">d6 = [";
        let individual_rolls = this.GetIndividualRolls();
        for (let i = 0; i < individual_rolls.length; i += 1) {
            results_text += individual_rolls[i].result + (i < individual_rolls.length - 1 ? ", " : "");
        }
        results_text += "]</span>";
        results_text += "<p>";
        return results_text;
    }

    GetBonusPointsText(){
        return (this._settingIsBonusPointApplied() ? "<p><b>" + game.i18n.localize("RNCS.results-text.bonus.label") + ":</b> " + this._bonus_point_total + "</p>" : "");
    }

    GetNoteFromDM(){
        let note_from_dm = "<b>" + game.i18n.localize("RNCS.results-text.note-from-dm.label") + ":</b></br>";
        // Score distribution
        note_from_dm += "<em>";
        
        switch (this._settings.DistributionMethod) {
            case "apply-as-rolled":
                note_from_dm += game.i18n.localize("RNCS.results-text.note-from-dm.apply-as-rolled")
                break;
            case "distribute-freely":
                note_from_dm += game.i18n.localize("RNCS.results-text.note-from-dm.distribute-freely")
                break;
            case "ring-method":
                note_from_dm += game.i18n.localize("RNCS.results-text.note-from-dm.ring-method")
                break;
        }

        // Bonus Point distribution - if any
        if (this._settingIsBonusPointApplied()) { note_from_dm += game.i18n.localize("RNCS.results-text.note-from-dm.distribute-bonus-points"); }

        // Mention final score limit - if any
        if(!this._settings.Over18Allowed && (this._settings.DistributionMethod !== "apply-as-rolled" || this._settingIsBonusPointApplied()))
        {
            note_from_dm += (this._settings.Over18Allowed ? game.i18n.localize("RNCS.results-text.note-from-dm.final-scores-may") : game.i18n.localize("RNCS.results-text.note-from-dm.final-scores-may-not")) + game.i18n.localize("RNCS.results-text.note-from-dm.above-18");
            // Mention bonus points - if any - and any other bonuses
            if (this._settingIsBonusPointApplied()) { note_from_dm += game.i18n.localize("RNCS.results-text.note-from-dm.bonus-points"); }
            note_from_dm += game.i18n.localize("RNCS.results-text.note-from-dm.any-bonuses") + "</em>";
        }

        return "<p>" + note_from_dm + "</p>";
    }
}