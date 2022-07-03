import { DiceRoller } from "../dice-roller.js";
import JSON_Helper from "../../data/json-helper.js";

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
      title: game.i18n.localize("RNCS.dialog.results-button.configure-new-actor"),
      id: 'distribute-ability-scores',
      icon: 'fas fa-cogs', // Change?
      template: "./modules/roll-new-character-stats/templates/form-apps/distribute-ability-scores.html",
      height: 475,
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
    const jh = new JSON_Helper();
    const jsonDATA = await jh.getJSONData("./modules/roll-new-character-stats/data/racial-bonus.json");
    switch (game.system.id) {
      case "dnd5e":
        return jsonDATA.game_system[0].dnd5e.races;
      case "pf1e":
        return jsonDATA.game_system[0].pf1e.races;
      default:// Default to dnd5e for now
        return jsonDATA.game_system[0].dnd5e.races;
    }
  }

  async _updateObject(event, formData) {

    let actor = await Actor.create({
      name: formData.charactername, // TODO-LOW: use formData.charactername
      type: "character",
      img: "icons/svg/mystery-man.svg"
    });
    switch (game.system.id) {
      case "dnd5e":
        // dnd5e Racial bonus source used for ./data/racial-bonus.json: https://docs.google.com/document/d/1PhQ933l3svEnqREAYwPKwJOlxPFK5R4s1TwwZ4Xem8Y
        await actor.update({
          'data.details.race': formData.select_race,
          'data.abilities.str.value': formData.str_final_score,
          'data.abilities.dex.value': formData.dex_final_score,
          'data.abilities.con.value': formData.con_final_score,
          'data.abilities.int.value': formData.int_final_score,
          'data.abilities.wis.value': formData.wis_final_score,
          'data.abilities.cha.value': formData.cha_final_score
        });
        break;
      case "pf1e":// TODO-HIGH: Verify attribute paths
        await actor.update({
          'data.abilities.str.value': formData.str_final_score,
          'data.abilities.dex.value': formData.dex_final_score,
          'data.abilities.con.value': formData.con_final_score,
          'data.abilities.int.value': formData.int_final_score,
          'data.abilities.wis.value': formData.wis_final_score,
          'data.abilities.cha.value': formData.cha_final_score
        });
        break;
      default:// default to dnd5e for now
        await actor.update({
          'data.abilities.str.value': formData.str_final_score,
          'data.abilities.dex.value': formData.dex_final_score,
          'data.abilities.con.value': formData.con_final_score,
          'data.abilities.int.value': formData.int_final_score,
          'data.abilities.wis.value': formData.wis_final_score,
          'data.abilities.cha.value': formData.cha_final_score
        });
        break;
    }
  }
}

window.DistributeAbilityScores = DistributeAbilityScores;