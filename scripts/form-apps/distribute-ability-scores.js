import { DiceRoller } from "../dice-roller.js";

Hooks.on('renderDistributeAbilityScores', () => {
  // Add dragstart listeners for each result element
  const dice_roller = new DiceRoller;
  for (let i = 0; i < dice_roller._settingNumberOfRollsCount(); i++) {
    const div_final_result = document.getElementById("div_final_result" + i);
    if (div_final_result) {
      div_final_result.addEventListener("dragstart", dragstart_handler);
    }
  }
  const ability_scores = document.getElementById("ability_scores");
  if (ability_scores.dataset.distributeresults === "false") { ApplyAsRolled(); }
});

function dragstart_handler(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.parentElement);
  ev.dataTransfer.setData("text/plain", ev.target.innerText); // value of element being dragged
  ev.dataTransfer.setData("text/plain", ev.target.id);        // id of element being dragged
  ev.dataTransfer.dropEffect = "copy";
}

export class DistributeAbilityScores extends FormApplication {
  constructor(abilities, final_results, bonus_points, over18allowed, distributeResults, msgId, races) {
    super();
    this.abilities = abilities,
    this.final_results = final_results,
    this.bonus_points = bonus_points,
    this.over18allowed = over18allowed,
    this.distributeResults = distributeResults,
    this.msgId = msgId,
    this.races = races
  }


  // async close() {
  //   const msg = game.messages.get(this.msgId);
  //   let content = duplicate(msg.data.content);
  //   await msg.update({content: content});
  //   super.close();
  // }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize("RNCS.dialog.results-button.distribute-results"),
      id: 'distribute-ability-scores',
      icon: 'fas fa-cogs', // Change?
      template: "./modules/roll-new-character-stats/templates/form-apps/distribute-ability-scores.html",
      height: 470,
      width: 375,
      closeOnSubmit: true,
      submitOnClose: false
    });
  }

  async getData() {
    return {
      abilities: this.abilities,
      final_results: this.final_results,
      bonus_points: this.bonus_points,
      over18allowed: this.over18allowed,
      distributeResults: this.distributeResults,
      msgId: this.msgId,
      races: await this.getSystemRaces()
    };
  }

  async getSystemRaces() {
    // TODO-LOW: Farm this out to a helper when other JSON files are implemented
    const jsonDATA = await fetch("./modules/roll-new-character-stats/data/racial-bonus.json")
      .then(response => response.json())
      .then(data => {
        return data;
      });
    // TODO-MEDIUM: Switch Case game system
    return jsonDATA.game_system[0].dnd5e.races;
  }

  async _updateObject(event, formData) {

		let actor = await Actor.create({
			name: "New Actor", // TODO-LOW: use formData.charactername
			type: "character",
			img: "icons/svg/mystery-man.svg"
		});

    await actor.update({
      'data.abilities.str.value': formData.str_final_score,
      'data.abilities.dex.value': formData.dex_final_score,
      'data.abilities.con.value': formData.con_final_score,
      'data.abilities.int.value': formData.int_final_score,
      'data.abilities.wis.value': formData.wis_final_score,
      'data.abilities.cha.value': formData.cha_final_score
    });
  }
}

window.DistributeAbilityScores = DistributeAbilityScores;