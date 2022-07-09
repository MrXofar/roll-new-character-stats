/* global CONFIG */

import { DiceRoller } from "../dice-roller.js";
// import JSON_Helper from "../../data/json-helper.js";
import SYSTEM_Helper from "../../data/system-helper.js";

Hooks.on('renderDistributeAbilityScores', () => {
  // Add dragstart listeners for each result element
  const dice_roller = new DiceRoller;
  for (let i = 0; i < dice_roller._settingNumberOfRollsCount(); i++) {
    const div_final_result = document.getElementById("div_final_result" + i);
    if (div_final_result) {
      div_final_result.addEventListener("dragstart", dragstart_handler);
    }
  }
  Intitialize();
});

function dragstart_handler(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.parentElement);
  ev.dataTransfer.setData("text/plain", ev.target.innerText); // value of element being dragged
  ev.dataTransfer.setData("text/plain", ev.target.id);        // id of element being dragged
  ev.dataTransfer.dropEffect = "copy";
}

export class DistributeAbilityScores extends FormApplication {
  constructor(final_results, bonus_points, over18allowed, distributeResults, msgId, abilities, races) {
    super();
    this.final_results = final_results,
    this.bonus_points = bonus_points,
    this.over18allowed = over18allowed,
    this.distributeResults = distributeResults,
    this.msgId = msgId,
    this.abilities = abilities,
    this.races = races
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize("RNCS.dialog.results-button.configure-new-actor"),
      id: 'distribute-ability-scores',
      icon: 'fas fa-cogs', // Change?
      template: "./modules/roll-new-character-stats/templates/form-apps/distribute-ability-scores.html",
      height: 540,
      width: 375,
      closeOnSubmit: true,
      submitOnClose: false
    });
  }

  async getData() {
    const system_helpler = new SYSTEM_Helper();
    return {      
      final_results: this.final_results,
      bonus_points: this.bonus_points,
      over18allowed: this.over18allowed,
      distributeResults: this.distributeResults,
      msgId: this.msgId,
      abilities: await system_helpler.getSystemAbilities(),
      races: await system_helpler.getSystemRaces()
    };
  }

  async _updateObject(event, formData) {

    var actor_type;
    switch(game.system.id){
      case "dnd5e":
      case "pf1":
      case "ose":
      case "archmage":
        actor_type = "character"
        break;
      case "dcc":
        actor_type = "Player"
        break;
      default:
        actor_type = "character"
    }

    let actor = await Actor.create({
      name: ((formData.charactername === "New Actor" || formData.charactername === "") && formData.select_race !== "" ? formData.select_race : formData.charactername),
      type: actor_type, 
      img: "icons/svg/mystery-man.svg"
    });


// TODO-MEDIUM: Include other racial skills/features/bonuses/languages

    switch (game.system.id) {
      case "dnd5e":
        // _final_score_display includes Racial Mod - will revisit this when dnd5e implements race items (see pf1).
        await actor.update({
          'data.details.race': formData.select_race,
          'data.abilities.str.value': formData.str_final_score_display, 
          'data.abilities.dex.value': formData.dex_final_score_display,
          'data.abilities.con.value': formData.con_final_score_display,
          'data.abilities.int.value': formData.int_final_score_display,
          'data.abilities.wis.value': formData.wis_final_score_display,
          'data.abilities.cha.value': formData.cha_final_score_display
        });
        break;

      case "pf1":
        // _final_score_unmod does not include Racial Mod as that value is added by embedded obj_race_item
        await actor.update({
          'data.abilities.str.value': formData.str_final_score_unmod, 
          'data.abilities.dex.value': formData.dex_final_score_unmod,
          'data.abilities.con.value': formData.con_final_score_unmod,
          'data.abilities.int.value': formData.int_final_score_unmod,
          'data.abilities.wis.value': formData.wis_final_score_unmod,
          'data.abilities.cha.value': formData.cha_final_score_unmod
        });

        // TODO-LOW: Figure out how to include "flavored" pf1 races
        
        // Embed race item document
        this.EmbedItem(actor, "pf1.races", formData.select_race);

        break;

      case "ose":
        // Ose does not automatically calculate .bonus
        await actor.update({
          'data.scores.str.value': formData.str_final_score_display,
          'data.scores.dex.value': formData.dex_final_score_display,
          'data.scores.con.value': formData.con_final_score_display,
          'data.scores.int.value': formData.int_final_score_display,
          'data.scores.wis.value': formData.wis_final_score_display,
          'data.scores.cha.value': formData.cha_final_score_display,
          'data.scores.str.bonus': formData.str_modifier,
          'data.scores.dex.bonus': formData.dex_modifier,
          'data.scores.con.bonus': formData.con_modifier,
          'data.scores.int.bonus': formData.int_modifier,
          'data.scores.wis.bonus': formData.wis_modifier,
          'data.scores.cha.bonus': formData.cha_modifier
        });
        break;

      case "archmage":
        await actor.update({
          'data.abilities.str.value': formData.str_final_score_display,
          'data.abilities.dex.value': formData.dex_final_score_display,
          'data.abilities.con.value': formData.con_final_score_display,
          'data.abilities.int.value': formData.int_final_score_display,
          'data.abilities.wis.value': formData.wis_final_score_display,
          'data.abilities.cha.value': formData.cha_final_score_display
        });

        // "archmage" does have race items in a compendium, but they are named weirdly and don't seem to have ability bonuses.

        break;

      case "dcc":
        await actor.update({
          'data.abilities.str.value': formData.str_final_score_display,
          'data.abilities.agl.value': formData.agl_final_score_display,
          'data.abilities.sta.value': formData.sta_final_score_display,
          'data.abilities.per.value': formData.per_final_score_display,
          'data.abilities.int.value': formData.int_final_score_display,
          'data.abilities.lck.value': formData.lck_final_score_display,
          'data.abilities.str.max': formData.str_final_score_display,
          'data.abilities.agl.max': formData.agl_final_score_display,
          'data.abilities.sta.max': formData.sta_final_score_display,
          'data.abilities.per.max': formData.per_final_score_display,
          'data.abilities.int.max': formData.int_final_score_display,
          'data.abilities.lck.max': formData.lck_final_score_display
        });
        break;

      default:// default to dnd5e for now
        await actor.update({
          'data.details.race': formData.select_race,
          'data.abilities.str.value': formData.str_final_score_display,
          'data.abilities.dex.value': formData.dex_final_score_display,
          'data.abilities.con.value': formData.con_final_score_display,
          'data.abilities.int.value': formData.int_final_score_display,
          'data.abilities.wis.value': formData.wis_final_score_display,
          'data.abilities.cha.value': formData.cha_final_score_display
        });
        break;
    }
  }  

  async EmbedItem(actor, pack_id, item_name) {
    const pack = game.packs.get(pack_id);
    const itemId = pack.index.getName(item_name)?._id;
    if (itemId) {
      const _item = await pack.getDocument(itemId);
      const obj_item = _item.data.toObject();
      await actor.createEmbeddedDocuments("Item", [obj_item]);
    }
  }
}

window.DistributeAbilityScores = DistributeAbilityScores;