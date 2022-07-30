import { DiceRoller } from "../dice-roller.js";
import { RegisteredSettings } from "../registered-settings.js";
import GAME_SYSTEM_Helper from "../../data/game-system-helper.js";
import dnd5e_ActorHelper from "../helpers/dnd5e-actor-helper.js";
import pf1_ActorHelper from "../helpers/pf1-actor-helper.js";
import ose_ActorHelper from "../helpers/ose-actor-helper.js";
import archmage_ActorHelper from "../helpers/archmage-actor-helper.js";
import dcc_ActorHelper from "../helpers/dcc-actor-helper.js";

const game_system_helper = new GAME_SYSTEM_Helper();

Hooks.on('renderConfigureActor', () => {
    // Add dragstart listeners for each result element
    const dice_roller = new DiceRoller;
    for (let i = 0; i < dice_roller._settingNumberOfSetsRolledCount(); i++) {
        const div_final_result = document.getElementById("div_final_result" + i);
        if (div_final_result) {
            div_final_result.addEventListener("dragstart", dragstart_handler);
        }
    }
    const div_ring_result = document.getElementById("div_ring_final_result");
    if (div_ring_result) {
        div_ring_result.addEventListener("dragstart", dragstart_handler);
    }
    Intitialize();
});

function dragstart_handler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.parentElement);
    ev.dataTransfer.setData("text/plain", ev.target.innerText); // value of element being dragged
    ev.dataTransfer.setData("text/plain", ev.target.id);        // id of element being dragged
    ev.dataTransfer.dropEffect = "copy";
}

export class ConfigureActor extends FormApplication {

    // Properties
    _settings = new RegisteredSettings;

    constructor(owner_id, final_results, bonus_points, other_properties_results, individual_rolls, Over18Allowed, DistributionMethod, HideResultsZone) {
        super(); 
        this.owner_id = owner_id,
        this.final_results = final_results, 
        this.bonus_points = bonus_points,
        this.other_properties_results = other_properties_results,
        this.individual_rolls = individual_rolls,
        this.Over18Allowed = Over18Allowed,
        this.DistributionMethod = DistributionMethod,
        this.HideResultsZone = HideResultsZone
    }

    static get defaultOptions() {

        return foundry.utils.mergeObject(super.defaultOptions, {
            title: game.i18n.localize("RNCS.dialog.results-button.configure-new-actor"),
            id: 'configure-actor',
            template: "./modules/roll-new-character-stats/templates/form-apps/configure-actor.hbs",
            height: 610, 
            width: 375,
            closeOnSubmit: true,
            submitOnClose: false
        });
    }

    // Send data to Configure Actor form
    async getData() {
        
        // Use [game-system]-actor-handler class roll "other properties" to be displayed on form application.
        // these are only necessary if enhanced support is intended
        // let dnd5e_actor_helper = null;      // For future use
        // let pf1_actor_helper = null;        // For future use
        // let ose_actor_helper = null;        // For future use
        // let archmage_actor_helper = null;   // For future use
        let dcc_actor_helper = null;
        
        // Roll/Set "Other Properties"
        let character_name = "New Actor";
        let description = "";
        let hp_base = 1;
        let hp_modifier_ability = "con";
        let currency_pp = 0;
        let currency_ep = 0;
        let currency_gp = 0;
        let currency_sp = 0;
        let currency_cp = 0;
        
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

                // Actor document is not passed in at this time since one will not be created until player accepts the new actor
                // other_properties_results contains the player's rolls for properties such as hp, occupation, equipment, luck etc.
                dcc_actor_helper = new dcc_ActorHelper(null, this.other_properties_results, this.owner_id); 

                // Roll/Set common properties
                hp_base = dcc_actor_helper._RollBaseHitPoints("1d4"); // default formula provided in case no other_properties_results provided 
                hp_modifier_ability = dcc_actor_helper._hp_modifier_ability;          
                currency_cp = dcc_actor_helper._RollStartingMoney("5d12","cp");  // default formula provided in case no other_properties_results provided

                // Roll/Set system unique properties
                dcc_actor_helper.stamina_modifier = CONFIG.DCC.abilities.modifiers[this.final_results[2]];// Stamina Modifier
                dcc_actor_helper.luck_modifier = CONFIG.DCC.abilities.modifiers[this.final_results[5]];// Luck Modifier
                await dcc_actor_helper.RollOccupation();    // No return value - set internaly and passed to form application
                await dcc_actor_helper.RollEquipment();     // No return value - set internaly and passed to form application
                await dcc_actor_helper.RollLuck();          // No return value - set internaly and passed to form application

                // Build description
                description = dcc_actor_helper.BuildDescription();

                // Get name
                character_name = dcc_actor_helper._character_name;
                
                break;
            default:
        }

        return {
            // Data passed to ConfigureActor form application
            final_results: this.final_results,
            bonus_points: this.bonus_points,
            individual_rolls: this.individual_rolls.map(x => x.result),
            Over18Allowed: this.Over18Allowed,
            DistributionMethod: this.DistributionMethod,
            HideResultsZone: this.HideResultsZone,

            // BEGIN Common Character data
            character_name: character_name,
            description: description,
            hp_base: hp_base,
            hp_modifier_ability: hp_modifier_ability,
            currency_cp: currency_cp,
            // END Common Character data

            // BEGIN Game System Unique data
            // dnd5e            
            is_dnd5e: game.system.id === "dnd5e",
            
            // pf1
            is_pf1: game.system.id === "pf1",

            // archmage
            is_archmage: game.system.id === "archmage",

            // ose
            is_ose: game.system.id === "ose",

            // dcc
            is_dcc: game.system.id === "dcc",
            dcc_occupation: dcc_actor_helper?.occupation,
            dcc_occupation_desc: dcc_actor_helper?.occupation_desc,
            dcc_farmer_type: dcc_actor_helper?.farmer_type,
            dcc_trade_good: dcc_actor_helper?.trade_good,
            dcc_farm_animal: dcc_actor_helper?.farm_animal,
            dcc_cart_content: dcc_actor_helper?.cart_content,
            dcc_equipment: dcc_actor_helper?.equipment,
            dcc_luck: dcc_actor_helper?.luck,    
            dcc_trade_weapon: dcc_actor_helper?.trade_weapon, 
            dcc_trade_weapon_ammo: dcc_actor_helper?.trade_weapon_ammo,  
            dcc_trade_weapon_ammo_qty: dcc_actor_helper?.trade_weapon_ammo_qty,             
            // END Game System Unique data            

            // Async data
            abilities: await game_system_helper.getSystemAbilities(),
            races: await game_system_helper.getSystemRaces()            
        };
    }
    
    async _updateObject(event, formData) {

        const owner = this.owner_id;
        let actor = await Actor.create({
            name: ((formData.character_name === "New Actor" || formData.character_name === "") && formData.select_race !== "" ? formData.select_race : formData.character_name),
            permission: { [owner]: CONST.DOCUMENT_PERMISSION_LEVELS.OWNER },
            type: game_system_helper.getSystemActorType(),
            img: "icons/svg/mystery-man.svg"
        });
        
        // Use [game-system]-actor-helper class to update actor
        switch (game.system.id) {
            case "dnd5e":
                let dnd5e_actor_helper = new dnd5e_ActorHelper(actor);
                dnd5e_actor_helper._Update(formData);
                break;
            case "pf1":
                let pf1_actor_helper = new pf1_ActorHelper(actor);
                pf1_actor_helper._Update(formData);
                break;
            case "ose":
                let ose_actor_helper = new ose_ActorHelper(actor);
                ose_actor_helper._Update(formData);
                break;
            case "archmage":
                let archmage_actor_helper = new archmage_ActorHelper(actor);
                archmage_actor_helper._Update(formData);
                break;
            case "dcc":
                let dcc_actor_helper = new dcc_ActorHelper(actor);
                dcc_actor_helper._Update(formData);
                break;
            default:
        }
    }
}

window.ConfigureActor = ConfigureActor;