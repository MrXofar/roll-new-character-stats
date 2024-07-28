// Commenting out this code but leaving it here for future reference
// RNCS button is being moved to the Actor tab where it belongs.

//import { RollStats } from './main.js';
//
//export class Controls {
//  constructor() {
//  }
//
//  initializeControls(controls) {
//    const tokenButton = controls.find((control) => control.name === 'token');
//    if (!tokenButton) return;
//    tokenButton.tools.push(this._rollNewCharacterStatsButton);
//  }
//
//  get _rollNewCharacterStatsButton() {
//    return {
//      name: 'roll-new-character-stats',
//      title: 'Roll New Character Stats',
//      icon: 'fas fa-dice',
//      button: true,
//      visible: true,
//      onClick: this._handleRollNewCharacterStatsClick,
//    };
//  }
//
//  async _handleRollNewCharacterStatsClick() {
//      RollStats();
//  }
//}
