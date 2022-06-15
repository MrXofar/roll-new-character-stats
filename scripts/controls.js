import RollStats from './roll-new-character-stats.js';
import { settingsKey } from "./settings.js";

/**
 * Handles setting up the controls for the module
 */
 export default class Controls {
    constructor() {
    }
  
    /**
     * Adds the Roll New Character Stats button to the token controls
     *
     * @param {Object[]} controls - the default controls provided by foundry
     * @returns
     */
    initializeControls(controls) {
      const tokenButton = controls.find((control) => control.name === 'token');
  
      if (!tokenButton) return;
  
      tokenButton.tools.push(this._rollNewCharacterStatsButton);
    }
  
    get _rollNewCharacterStatsButton() {
      return {
        name: 'roll-new-character-stats',
        title: 'Roll New Character Stats',
        icon: 'fas fa-dice',
        button: true,
        visible: true,
        onClick: this._handleRollNewCharacterStatsClick,
      };
    }
  
    async _handleRollNewCharacterStatsClick() {
      const confirmed = await Dialog.confirm({
        title: game.i18n.localize("RNCS.dialog.confirm-roll.Title"),
        content: game.i18n.localize("RNCS.dialog.confirm-roll.Method") + "</br>" + 
        game.i18n.localize("RNCS.settings.d6Method.choices." + game.settings.get(settingsKey, "d6Method")) + 
        (game.settings.get(settingsKey, "ReRollOnes") ? game.i18n.localize("RNCS.results-text.methods.but-re-roll-ones") : "") + "</br>" +      
        game.i18n.localize("RNCS.settings.NumberOfSetsRolls.choices." + game.settings.get(settingsKey, "NumberOfSetsRolls")) + "</br>" +  
        (game.settings.get(settingsKey, "BonusPoints") > 0 ? "+" + game.i18n.localize("RNCS.settings.BonusPoints.choices." + game.settings.get(settingsKey, "BonusPoints")) + "</br>" : "") +   
        (game.settings.get(settingsKey, "Over18Allowed") ? game.i18n.localize("RNCS.results-text.methods.over-18-allowed") : game.i18n.localize("RNCS.results-text.methods.over-18-not-allowed")) + "</br>" +     
        (game.settings.get(settingsKey, "DistributeResults") ? game.i18n.localize("RNCS.results-text.methods.distribute-freely") : game.i18n.localize("RNCS.results-text.methods.apply-as-rolled")) +    
        "</br></br>" + game.i18n.localize("RNCS.dialog.confirm-roll.Content")
      });

      if (confirmed) {
        RollStats();
      }
    }
  }
  