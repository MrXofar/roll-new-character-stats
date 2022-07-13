/**
 * dice-roller is responsible for building the appropriate roll formula 
 * and applying rules to those rolls based on user settings
 * and building the message text to display the results.  
 */

import { settingsKey } from "./settings.js";
import { namedfields } from "./constants.js";
import { RollNewCharacterStats } from "./main.js";
import SYSTEM_Helper from "../data/system-helper.js";

const num_dice = namedfields('description', 'die', 'difficulty');
const num_roll = namedfields('description', 'roll_count', 'difficulty');
const bonus_points = namedfields('description', 'difficulty');

export class DiceRoller {
    constructor(
        results_abilities = [], // Results of dice rolled for abilities
        drop_val_index = -1,    // Index of roll to be displayed as "Dropped =>" from [results_abilities] 
        bonus_results = 0,       // Result of RollBonusPoints()
        occupation,
        equipment = [],
        luck
    ) {
        this.results_abilities = results_abilities,
        this.drop_val_index = drop_val_index,
        this.bonus_results = bonus_results,
        this.occupation = occupation,
        this.equipment = equipment,
        this.luck = luck
    }

    // Roll Them Dice!
    async RollThemDice(character_property) {

        switch (character_property) {
            case "abilities":
                this.RollAbilities();
                break;                

            case "occupation":
                switch(game.system.id)
                {
                    case "dcc":
                        await this.RollOccupation();
                        break;
                    default:
                }
                break;

            case "equipment":
                switch(game.system.id)
                {
                    case "dcc":
                        await this.RollEquipment(1);
                        break;
                    default:
                }
                break;

            case "luck":
                switch(game.system.id)
                {
                    case "dcc":
                        await this.RollLuck();
                        break;
                    default:
                }
                break;

            case "race":
            case "class":
            case "subclass":
            case "armor":
            case "weapons":
            case "tools":
            case "currency":
            case "spells":
            case "features":
            case "other-properties":
                console.log(RollNewCharacterStats.ID + " | The character_property \"" + character_property + "\" has not been implemented for RollThemDice yet");
                break;

            default:
                console.log(RollNewCharacterStats.ID + " | RollThemDice does not recognize the character_property \"" + character_property + "\"");
        }
    }

    Formula_Abilities() {

// TODO-LOW: Add DieType|Sides setting to roll different sided die for abilities under different game systems
// TODO-LOW: Change "roll +modifiers" into a separate setting 

        let formula = this._settingAbilitiesRollMethodNumDie();
        formula += "d6"; 
        formula += (this._settingRerollOnes() ? "rr1" : "");
        formula += (this._settingDropLowestDieRoll() ? "dl" : "") 
        formula += this._settingAbilitiesRollMethodNumDie() === 2 ? "+6" : "";
        return formula;
    }

    RollAbilities(){
        // Ability Rolls
        for (let rs = 0; rs < this._settingNumberOfRollsCount(); rs++) {
            const roll = new Roll(this.Formula_Abilities());
            const rolled_results = roll.evaluate({ async: false });
            if(game.settings.get(settingsKey, "DiceSoNiceEnabled")){game.dice3d?.showForRoll(roll);}            
            this.results_abilities.push(rolled_results)
        }

        // Drop Lowest Set
        if (this._settingDropLowestSet()) {
            const results = this.results_abilities.map(function (e) { return e.total; }).join(',').split(',').map(Number);
            const drop_val = Math.min(...results);
            this.drop_val_index = results.indexOf(drop_val);
        }

        // Bonus Points
        switch (parseInt(game.settings.get(settingsKey, "BonusPoints"))) {
            case 0: //"0 Bonus Points":
                this.bonus_results = 0;
                break;
            case 1: //"1 Bonus Point":
                this.bonus_results = 1;
                break;
            case 2: //"1d4 Bonus Points":
                const bonus = new Roll("1d4");
                this.bonus_results = bonus.evaluate({ async: false }).total;
                if(game.settings.get(settingsKey, "DiceSoNiceEnabled")){game.dice3d?.showForRoll(bonus);} 
                break;
            default:
        }
    }

    // DCC Properties BEGIN
    async RollOccupation(){
        let pack = null;
        let entry = null;
        switch (game.system.id) {
            case "dcc":
                pack = game.packs.get("dcc-core-book.dcc-core-tables")// Premium Pack
                entry = pack?.index.getName("Table 1-3: Occupation");
                break;
            default:
        }
        const table = await pack?.getDocument(entry._id)
        const result = await table?.roll()
        const rolled_occupation = result?.results[0]
        if(rolled_occupation){
            if(game.settings.get(settingsKey, "DiceSoNiceEnabled")){game.dice3d?.showForRoll(result?.roll);}  
            this.occupation = rolled_occupation.data.text;
        }
    }

    async RollEquipment(num_items) {
        let pack = null;
        let entry = null;
        switch (game.system.id) {
            case "dcc":
                pack = game.packs.get("dcc-core-book.dcc-core-tables")// Premium Pack
                entry = pack?.index.getName("Table 3-4: Equipment");
                break;
            default:
        }
        for (let count = 0; count < num_items; count += 1) {
            const table = await pack?.getDocument(entry._id)
            const result = await table?.roll()
            const rolled_equipment = result?.results[0]
            if(rolled_equipment){
                if(game.settings.get(settingsKey, "DiceSoNiceEnabled")){game.dice3d?.showForRoll(result?.roll);}  
                this.equipment.push(rolled_equipment.data.text);
            }
        }
    }

    async RollLuck(){
        let pack = null;
        let entry = null;
        switch (game.system.id) {
            case "dcc":
                pack = game.packs.get("dcc-core-book.dcc-core-tables")// Premium Pack
                entry = pack?.index.getName("Table 1-2: Luck Score");
                break;
            default:
        }
        const table = await pack?.getDocument(entry._id)
        const result = await table?.roll()
        const rolled_luck = result?.results[0]
        if(rolled_luck){
            if(game.settings.get(settingsKey, "DiceSoNiceEnabled")){game.dice3d?.showForRoll(result?.roll);}  
            this.luck = rolled_luck.data.text;
        }
    }
    // DCC Properties END

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
        return (game.system.id === "dcc" ? parseInt(game.settings.get(settingsKey, "NumberOfActors")) : 1);
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
        return this.AbilitiesRollMethod()[parseInt(game.settings.get(settingsKey, "AbilitiesRollMethod"))].description;
    }
    _settingAbilitiesRollMethodNumDie() {
        return this.AbilitiesRollMethod()[parseInt(game.settings.get(settingsKey, "AbilitiesRollMethod"))].die;
    }
    AbilitiesRollMethodDifficulty() {
        return this.AbilitiesRollMethod()[parseInt(game.settings.get(settingsKey, "AbilitiesRollMethod"))].difficulty;
    }

    // Number of rolls details for Abilities (6 Sets, 7 Sets, etc...)
    NumberOfRolls() {
        return [
            num_roll(game.i18n.localize("RNCS.settings.NumberOfRolls.choices.0"), 6, 0),
            num_roll(game.i18n.localize("RNCS.settings.NumberOfRolls.choices.1"), 7, 1)
        ];
    }
    NumberOfRollsDesc() {
        return this.NumberOfRolls()[parseInt(game.settings.get(settingsKey, "NumberOfRolls"))].description;
    }
    _settingNumberOfRollsCount() {
        return this.NumberOfRolls()[parseInt(game.settings.get(settingsKey, "NumberOfRolls"))].roll_count;
    }
    NumberOfRollsDifficulty() {
        return this.NumberOfRolls()[parseInt(game.settings.get(settingsKey, "NumberOfRolls"))].difficulty;
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
        return this.BonusPoints()[parseInt(game.settings.get(settingsKey, "BonusPoints"))].description;
    }
    BonusPointsDifficulty() {
        return this.BonusPoints()[parseInt(game.settings.get(settingsKey, "BonusPoints"))].difficulty;
    }
    _settingIsBonusPointApplied() {
        return parseInt(game.settings.get(settingsKey, "BonusPoints")) > 0;
    }

    // Other roll constraints and rules
    _settingDropLowestDieRoll() {
        return game.settings.get(settingsKey, "DropLowestDieRoll");
    }
    _settingRerollOnes() {
        return game.settings.get(settingsKey, "ReRollOnes");
    }
    _settingDropLowestSet() {
        return game.settings.get(settingsKey, "DropLowestSet");
    }
    _settingOver18Allowed() {
        return game.settings.get(settingsKey, "Over18Allowed");
    }
    _settingDistributeResults() {
        return game.settings.get(settingsKey, "DistributeResults");
    }

    // Get results text
    GetMethodText() {
        let method_text = "<p><b>" + game.i18n.localize("RNCS.results-text.methods.label") + ":</b></br>";
        method_text += "<em>" + game.i18n.localize("RNCS.settings.AbilitiesRollMethod.choices." + game.settings.get(settingsKey, "AbilitiesRollMethod"));
        method_text += (game.settings.get(settingsKey, "DropLowestDieRoll") ? game.i18n.localize("RNCS.results-text.methods.drop-lowest-die") : "");
        method_text += (game.settings.get(settingsKey, "ReRollOnes") ? game.i18n.localize("RNCS.results-text.methods.re-roll-ones") : "") + "</br>";
        method_text += game.i18n.localize("RNCS.settings.NumberOfRolls.choices." + game.settings.get(settingsKey, "NumberOfRolls"));
        method_text += (game.settings.get(settingsKey, "DropLowestSet") ? game.i18n.localize("RNCS.results-text.methods.drop-lowest-set") : "") + "</br>";
        method_text += (game.settings.get(settingsKey, "BonusPoints") > 0 ? "+" + game.i18n.localize("RNCS.settings.BonusPoints.choices." + game.settings.get(settingsKey, "BonusPoints")) + "</br>" : "");
        if(!game.settings.get(settingsKey, "Over18Allowed") && (game.settings.get(settingsKey, "DistributeResults") || game.settings.get(settingsKey, "BonusPoints") > 0))
        {
            method_text += game.i18n.localize("RNCS.results-text.methods.over-18-not-allowed") + "</br>"
        }
        method_text += (game.settings.get(settingsKey, "DistributeResults") ? game.i18n.localize("RNCS.results-text.methods.distribute-freely") : game.i18n.localize("RNCS.results-text.methods.apply-as-rolled")) + "</em>"
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
        difficulty += this._settingRerollOnes() ? 3 : 0;
        difficulty += this._settingDropLowestDieRoll() ? 1 : 0;
        difficulty += this._settingDropLowestSet() ? 1 : 0;
        difficulty += this._settingOver18Allowed() ? 2 : 0;
        difficulty += this._settingDistributeResults() ? 3 : 0;

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
        let results_text = "<b>" + game.i18n.localize("RNCS.results-text.results.label") + ":</b> " + game.i18n.localize("RNCS.results-text.results.abilities") + "</br>";
        let apply_to = "";
        const system_helper = new SYSTEM_Helper();
        const abilities = await system_helper.getSystemAbilities();
        let att_idx = 0;

        // NOTE: If more rolls than needed to fill abilities is selected, and Distrubute results is unchecked without selecting Drop Lowest Set,
        // the last roll will still be displayed, but not applied to any ability. 
        // This might look confusing to players - so maybe a way to indicate this in the chat message??
        for (let set = 0; set < this.results_abilities.length; set++) {
            const d6_results = this.results_abilities[set].dice[0].results.map(function (e) { return e.result; }).join(', ');
            apply_to = att_idx < abilities.length && !this._settingDistributeResults() && this.drop_val_index !== set ? "<label class=\"ability-text\">" + abilities[att_idx] + "</label>: " : "";
            results_text += apply_to;
            results_text += this.drop_val_index === set ? "Dropped => " : "";
            results_text += this.results_abilities[set].total + " [" + d6_results + "]";
            if (this.drop_val_index !== set && this.results_abilities[set].total === 18) { results_text += " - Booyah!"; }
            if (set < this.results_abilities.length - 1) {results_text += "<br />";}
            if (this.drop_val_index !== set) { att_idx++; }
        }
        return results_text;
    }
    GetBonusPointsText(){
        return (this._settingIsBonusPointApplied() ? "<p><b>" + game.i18n.localize("RNCS.results-text.bonus.label") + ":</b> " + this.bonus_results + "</p>" : "</br>");
    }
    GetNoteFromDM(){
        let note_from_dm = "<b>" + game.i18n.localize("RNCS.results-text.note-from-dm.label") + ":</b></br>";
        // Score distribution
        note_from_dm += "<em>" + (this._settingDistributeResults() ? game.i18n.localize("RNCS.results-text.note-from-dm.distribute-freely") : game.i18n.localize("RNCS.results-text.note-from-dm.apply-as-rolled"));
        // Bonus Point distribution - if any
        if (this._settingIsBonusPointApplied()) { note_from_dm += game.i18n.localize("RNCS.results-text.note-from-dm.distribute-bonus-points"); }

        // Mention final score limit - if any
        if(!this._settingOver18Allowed() && (this._settingDistributeResults() || this._settingIsBonusPointApplied()))
        {
            note_from_dm += (this._settingOver18Allowed() ? game.i18n.localize("RNCS.results-text.note-from-dm.final-scores-may") : game.i18n.localize("RNCS.results-text.note-from-dm.final-scores-may-not")) + game.i18n.localize("RNCS.results-text.note-from-dm.above-18");
            // Mention bonus points - if any - and any other bonuses
            if (this._settingIsBonusPointApplied()) { note_from_dm += game.i18n.localize("RNCS.results-text.note-from-dm.bonus-points"); }
            note_from_dm += game.i18n.localize("RNCS.results-text.note-from-dm.any-bonuses") + "</em>";
        }

        return "<p>" + note_from_dm + "</p>";
    }
}