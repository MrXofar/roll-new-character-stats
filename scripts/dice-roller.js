/**
 * dice-roller is responsible for building the appropriate roll formula and applying rules to those rolls based on user settings. *  
 */

import { settingsKey } from "./settings.js";
import { namedfields } from "./constants.js";

const num_dice = namedfields('description', 'die', 'difficulty');
const num_roll = namedfields('description', 'rolls', 'difficulty');
const bonus_points = namedfields('description', 'difficulty');

export class DiceRoller {
    constructor(
        result_sets = [],       // Results of rolled dice
        drop_val_index = -1,    // Index of roll to be displayed as "Dropped =>" from [result_set] 
        bonus_results = 0       // Result of RollBonusPoints()
    ) {
        this.result_sets = result_sets,
        this.drop_val_index = drop_val_index,
        this.bonus_results = bonus_results
    }

    RollFormula() {
        var formula = this.d6MethodNumDie();
        formula += "d6";
        formula += (this.RerollOnes() ? "rr1" : "");
        formula += (this.DropLowestDieRoll() ? "dl" : "") 
        formula += this.d6MethodNumDie() === 2 ? "+6" : "";// 2d6+6 method - TODO: Change these types of "roll modifiers" into a separate setting 
        return formula;
    }

    RollThemDice() {

        // Roll
        for (var rs = 0; rs < this.SetMethodRolls(); rs++) {
            var roll = new Roll(this.RollFormula());
            var rolled_results = roll.evaluate({ async: false });
            game.dice3d?.showForRoll(roll);
            this.result_sets.push(rolled_results)
        }

        // Drop lowest?
        if (this.DropLowestSet()) { 
            this.DropLowestSetRolled();
        }

        // Roll Bonus points
        this.RollBonusPoints();
    }

    // Drop and store index of lowest set rolled.
    // Leaving this as a separate method in case I want to drop results from other sets for other reasons
    DropLowestSetRolled() {
        var results = this.result_sets.map(function (e) { return e.total; }).join(',').split(',').map(Number);
        var drop_val = Math.min(...results);
        this.drop_val_index = results.indexOf(drop_val);
    }

    RollBonusPoints() {
        switch (parseInt(game.settings.get(settingsKey, "BonusPoints"))) {
            case 0: //"0 Bonus Points":
                this.bonus_results = 0;
                break;
            case 1: //"1 Bonus Point":
                this.bonus_results = 1;
                break;
            case 2: //"1d4 Bonus Points":
                var bonus = new Roll("1d4");
                this.bonus_results = bonus.evaluate({ async: false }).total;
                game.dice3d?.showForRoll(bonus);
                break;
            default:
        }
    }

    d6Method() {
        return [
            num_dice(game.i18n.localize("RNCS.settings.d6Method.choices.0"), 3, 0),
            num_dice(game.i18n.localize("RNCS.settings.d6Method.choices.1"), 4, 2),
            num_dice(game.i18n.localize("RNCS.settings.d6Method.choices.2"), 2, 3)
        ];
    }
    d6MethodDesc() {
        return this.d6Method()[parseInt(game.settings.get(settingsKey, "d6Method"))].description;
    }
    d6MethodNumDie() {
        return this.d6Method()[parseInt(game.settings.get(settingsKey, "d6Method"))].die;
    }
    d6MethodDieDifficulty() {
        return this.d6Method()[parseInt(game.settings.get(settingsKey, "d6Method"))].difficulty;
    }
    DropLowestDieRoll() {
        return game.settings.get(settingsKey, "DropLowestDieRoll");
    }

    // TODO: Maybe do some renaming here for "NumberOfSetsRolls", "method", and "rolls"???
    // "Set" isn't really a good term to use here as it implies the action "to set" - find another term that refers to "SetsRolled"
    // Group/Collection ???
    SetMethod() {
        return [
            num_roll(game.i18n.localize("RNCS.settings.NumberOfSetsRolls.choices.0"), 6, 0),
            num_roll(game.i18n.localize("RNCS.settings.NumberOfSetsRolls.choices.1"), 7, 1)
        ];
    }
    SetMethodDesc() {
        return this.SetMethod()[parseInt(game.settings.get(settingsKey, "NumberOfSetsRolls"))].description;
    }
    SetMethodRolls() {
        return this.SetMethod()[parseInt(game.settings.get(settingsKey, "NumberOfSetsRolls"))].rolls;
    }
    SetMethodDifficulty() {
        return this.SetMethod()[parseInt(game.settings.get(settingsKey, "NumberOfSetsRolls"))].difficulty;
    }
    DropLowestSet() {
        return game.settings.get(settingsKey, "DropLowestSet");
    }

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
    IsBonusPointApplied() {
        return parseInt(game.settings.get(settingsKey, "BonusPoints")) > 0;
    }

    RerollOnes() {
        return game.settings.get(settingsKey, "ReRollOnes");
    }
    Over18Allowed() {
        return game.settings.get(settingsKey, "Over18Allowed");
    }
    DistributeResults() {
        return game.settings.get(settingsKey, "DistributeResults");
    }

    GetDifficultyDesc() {

        var difficulty = 0;
        
        // Drop down selections with namedfields
        difficulty += this.d6MethodDieDifficulty();
        difficulty += this.SetMethodDifficulty();
        difficulty += this.BonusPointsDifficulty();

        // Check Box selections
        difficulty += this.RerollOnes() ? 3 : 0;
        difficulty += this.Over18Allowed() ? 2 : 0;
        difficulty += this.DistributeResults() ? 3 : 0;

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
        return difficulty_desc;
    }    

    ShowMethodText() {
        return game.i18n.localize("RNCS.settings.d6Method.choices." + game.settings.get(settingsKey, "d6Method")) +
            (game.settings.get(settingsKey, "DropLowestDieRoll") ? game.i18n.localize("RNCS.results-text.methods.drop-lowest-die") : "") +
            (game.settings.get(settingsKey, "ReRollOnes") ? game.i18n.localize("RNCS.results-text.methods.re-roll-ones") : "") + "</br>" +
            game.i18n.localize("RNCS.settings.NumberOfSetsRolls.choices." + game.settings.get(settingsKey, "NumberOfSetsRolls")) +
            (game.settings.get(settingsKey, "DropLowestSet") ? game.i18n.localize("RNCS.results-text.methods.drop-lowest-set") : "") + "</br>" +
            (game.settings.get(settingsKey, "BonusPoints") > 0 ? "+" + game.i18n.localize("RNCS.settings.BonusPoints.choices." + game.settings.get(settingsKey, "BonusPoints")) + "</br>" : "") +
            (game.settings.get(settingsKey, "Over18Allowed") ? game.i18n.localize("RNCS.results-text.methods.over-18-allowed") : game.i18n.localize("RNCS.results-text.methods.over-18-not-allowed")) + "</br>" +
            (game.settings.get(settingsKey, "DistributeResults") ? game.i18n.localize("RNCS.results-text.methods.distribute-freely") : game.i18n.localize("RNCS.results-text.methods.apply-as-rolled"))
    }
}