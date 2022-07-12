/* global CONFIG, CONST */

import { DiceRoller } from "../dice-roller.js";
// import JSON_Helper from "../../data/json-helper.js";
import SYSTEM_Helper from "../../data/system-helper.js";
import { settingsKey } from "../settings.js";

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
  constructor(owner_id, final_results, bonus_points, over18allowed, distributeResults, msgId, occupation, equipment_list, luck, abilities, races) {
    super();
    this.owner_id = owner_id,
    this.final_results = final_results,
    this.bonus_points = bonus_points,
    this.over18allowed = over18allowed,
    this.distributeResults = distributeResults,
    this.msgId = msgId,
    this.occupation = occupation,
    this.equipment_list = equipment_list,
    this.luck = luck,
    this.abilities = abilities,
    this.races = races
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize("RNCS.dialog.results-button.configure-new-actor"),
      id: 'distribute-ability-scores',
      icon: 'fas fa-cogs', // Change?
      template: "./modules/roll-new-character-stats/templates/form-apps/distribute-ability-scores.html",
      height: 570,
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
      occupation: this.occupation,
      equipment_list: this.equipment_list,
      luck: this.luck,
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

    const owner = this.owner_id;
    let actor = await Actor.create({
      name: ((formData.charactername === "New Actor" || formData.charactername === "") && formData.select_race !== "" ? formData.select_race : formData.charactername),
      permission: {[owner]: 3},//CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER <--- this doesn't work for me. Need to find out what I am doing wrong with CONST
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
        
        var pattern = /(?<=<td>)(.+?)(?=<\/td>)/g;
        const occupation_details = this.occupation.match(pattern);
        const playerOwners = Object.entries(actor.data.permission).filter(([id, level]) => level === 3).map(([id, level])=> id); //(!game.users.get(id)?.isGM && game.users.get(id)?.active) && 
        var note = "";
        
        // Check for other required rolls on occupation before embedding, such as farm animals, ammunition, etc.

        // † If a missile fre weapon (such as sling or dart), roll 1d6 to determine number of sling stones or darts.
        pattern = /dart|sling/i;
        if(occupation_details[1].match(pattern)) // Ranged Weapon† 
        {
          var roll = new Roll("1d6");
          var rolled_results = roll.evaluate({ async: false }).total;
          if(game.settings.get(settingsKey, "DiceSoNiceEnabled")){game.dice3d?.showForRoll(roll);}   
          if(occupation_details[1].includes("dart")){
              for(var i = 0; i < rolled_results; i += 1)
              {                
                this.EmbedItem(actor, "dcc-core-book.dcc-core-occupation-items", occupation_details[1]); //Weapon - Premium Pack
              }
          }else{
            this.EmbedItem(actor, "dcc-core-book.dcc-core-occupation-items", occupation_details[1]); // Weapon - Premium Pack}
            this.EmbedItem(actor, "dcc-core-book.dcc-core-ammunition", "Sling stones", rolled_results); // Ammunition - Premium Pack
          }
        }else{
          this.EmbedItem(actor, "dcc-core-book.dcc-core-occupation-items", occupation_details[1]); // Weapon - Premium Pack}
        }

        // * Roll 1d8 to determine farmer type: (1) potato, (2) wheat, (3) turnip, (4) corn, (5) rice, (6) parsnip, (7) radish, (8) rutabaga.
        var trade_good = occupation_details[2];
        var farmer_type = "";
        pattern = /\*/g;
        if(occupation_details[0].match(pattern)) // Occupation*
        {
          const farmer_types = ["Potato", "Wheat", "Turnip", "Corn", "Rice", "Parsnip", "Radish", "Rutabaga"]
          var roll = new Roll("1d8");
          var rolled_results = roll.evaluate({ async: false }).total;
          if(game.settings.get(settingsKey, "DiceSoNiceEnabled")){game.dice3d?.showForRoll(roll);}   
          farmer_type = farmer_types[rolled_results - 1];
        }
        // Update name
        var character_name = "";
        switch(game.settings.get(settingsKey, "NameFormat")){
          case "0":
            character_name = game.users.get(playerOwners[0])?.name + " (" + (farmer_type !== "" ? farmer_type + " " : "") + occupation_details[0] + ")"
            break;
          case "1":
            character_name = (farmer_type !== "" ? farmer_type + " " : "") + occupation_details[0] + " (" + game.users.get(playerOwners[0])?.name + ")"
            break;
          case "2":
            character_name = (farmer_type !== "" ? farmer_type + " " : "") + occupation_details[0];
            break;
          default:
        }
        character_name = character_name.replace("*","");
        


        // ** Why did the chicken cross the hallway? To check for traps! In all seriousness, if the party includes more than one farmer or herder, randomly determine the 
        // second and subsequent farm animals for each duplicated profession with 1d6: (1) sheep, (2) goat, (3) cow, (4) duck, (5) goose, (6) mule.
        pattern = /[^\*]\*{2}$/g;
        if(occupation_details[2].match(pattern)) // Trade Good**
        {
          // First check to see if there are other farmers || herders
          // NOTE: Checking for herders here is kinda sucky, deffinitely refactor this
          var farmers = game.actors.filter(i => i.data.data.details.occupation.value === "Farmer*");
          var herders = game.actors.filter(i => i.data.data.details.occupation.value === "Herder")
          var dwarven_herders = game.actors.filter(i =>  i.data.data.details.occupation.value === "Dwarven herder");
          if((farmers.length > 0 && occupation_details[0] === "Farmer*") || 
             (herders.length > 0 && occupation_details[0] === "Herder") || 
             (dwarven_herders.length > 0 && occupation_details[0] === "Dwarven herder")) {
            const farm_animal = ["Sheep", "Goat", "Cow", "Duck", "Goose", "Mule"]
            var roll = new Roll("1d6");
            var rolled_results = roll.evaluate({ async: false }).total;
            if(game.settings.get(settingsKey, "DiceSoNiceEnabled")){game.dice3d?.showForRoll(roll);}   
            trade_good = farm_animal[rolled_results - 1];
          }
        }    
        
        // *** Roll 1d6 to determine what’s in the cart: (1) tomatoes, (2) nothing, (3) straw, (4) your dead, (5) dirt, (6) rocks 
        pattern = /\*{3}/g;
        if(occupation_details[2].match(pattern)) // Trade Good***
        {
          const cart_contents = ["Tomatoes", "nothing", "Straw", "Your dead", "Dirt", "Rocks"]
          var roll = new Roll("1d6");
          var rolled_results = roll.evaluate({ async: false }).total;
          if(game.settings.get(settingsKey, "DiceSoNiceEnabled")){game.dice3d?.showForRoll(roll);}   
          if(rolled_results !== 2){
            this.EmbedItem(actor, "dcc-core-book.dcc-core-occupation-items", cart_contents[rolled_results - 1]); // Trade Good - Premium Pack
          }
        }

        //Trade Good
        this.EmbedItem(actor, "dcc-core-book.dcc-core-occupation-items", trade_good); // Trade Good - Premium Pack

        // Embed Equipment
        this.EmbedItem(actor, "dcc-core-book.dcc-core-equipment", this.equipment_list[0]); // Premium Pack

        // Build Note
        note += this.luck !== "" ? this.luck + " (" + formData.lck_modifier + ")" : "";

        // Finally update actor
        await actor.update({
          'name': (formData.charactername === "New Actor" || formData.charactername === "") ? character_name : formData.charactername,
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
          'data.abilities.lck.max': formData.lck_final_score_display,
          'data.details.occupation.value': occupation_details[0],
          'data.details.notes.value': note,
          'data.details.birthAugur': this.luck !== "" ? this.luck : ""
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

  async EmbedItem(actor, pack_id, item_name, qty) {
    qty = (qty > 1 ? qty : 1);
    const pack = game.packs.get(pack_id);
    const itemId = pack?.index.getName(item_name)?._id;
    if (itemId) {
      const _item = await pack.getDocument(itemId);
      const obj_item = _item.data.toObject();
      //console.log(obj_item);
      obj_item.data.quantity = qty;
      await actor.createEmbeddedDocuments("Item", [obj_item]);
    }
  }
  // Found this on discord, but can't remember from whom or from what
  // static firstOwner(doc){
  //   /* null docs could mean an empty lookup, null docs are not owned by anyone */
  //   if (!doc) return false;

  //   const playerOwners = Object.entries(doc.data.permission)
  //     .filter(([id, level]) => (!game.users.get(id)?.isGM && game.users.get(id)?.active) && level === 3)
  //     .map(([id, level])=> id);

  //   if(playerOwners.length > 0) {
  //     return game.users.get(playerOwners[0]);
  //   }

  //   // /* if no online player owns this actor, fall back to first GM */
  //   // return MODULE.firstGM();
  // }
}

window.DistributeAbilityScores = DistributeAbilityScores;