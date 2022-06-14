import RollStats from './roll-new-character-stats.js';

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
  
    _handleRollNewCharacterStatsClick() {
      RollStats();
    }
  }
  