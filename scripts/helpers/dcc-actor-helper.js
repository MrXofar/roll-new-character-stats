import { base_ActorHelper } from './_base-actor-helper.js';

// OPR_CONSTANTS
const opr = {
    HITPOINTS     : 0,  //1d4   => hit points
    STARTING_MONEY: 1,  //5d12  => starting money "cp"
    OCCUPATION    : 2,  //1d100 => occupation
    AMMO_QTY      : 3,  //1d6?  => missile weapon ammo
    FARMER_TYPE   : 4,  //1d8?  => farmer type
    FARM_ANIMAL   : 5,  //1d6?  => farm animal (trade good)
    CART_CONTENTS : 6,  //1d6?  => cart contents (trade good)
    EQUIPMENT     : 7,  //1d24  => equipment
    LUCK_STORE    : 8   //1d30  => luck store
}

export default class dcc_ActorHelper extends base_ActorHelper {

    // base property overrides
    _hp_modifier_ability = "sta";

    // dcc unique properties
    occupation = "";
    occupation_details = []; // array holding occupation name, weapon and trade good
    occupation_desc = "";
    equipment = "";
    luck = "";
    luck_modifier = 0;
    stamina_modifier = 0;
    farmer_type = "";
    farmer_types = ["Potato", "Wheat", "Turnip", "Corn", "Rice", "Parsnip", "Radish", "Rutabaga"];
    farm_animals = ["Sheep", "Goat", "Cow", "Duck", "Goose", "Mule"];
    cart_contents = ["Tomatoes", "nothing", "Straw", "Your dead", "Dirt", "Rocks"]; 
    cart_content = "";
    trade_good = "";
    trade_weapon = "";
    trade_weapon_ammo = "";
    trade_weapon_ammo_qty = 0;
    missile_weapons = ["Shortbow", "Sling"];// Excludes darts until they are given an ammo type by DCC game system developer
    note = "";

    constructor(actor, other_properties_results, owner_id) {
        super(actor, other_properties_results, owner_id);
    }
    
    // if(this.other_properties_results){
    //     this. = this.other_properties_results[opr.];
    // }else{
    //     this. = this._RollDiceForTotal("1d6");
    // }

    // UNIQUE DATA
    async RollOccupation() {

        const rolltable_doc = await this._GetDocumentFromCompendium("dcc-core-book.dcc-core-tables", "Table 1-3: Occupation"); // Premium Pack
        let rolled_occupation = null;

        if(this.other_properties_results){
            // let test = 36
            // rolled_occupation = rolltable_doc?.results.contents.filter(x => x.data.range[0] === test && x.data.range[1] >= test)[0];
            rolled_occupation = rolltable_doc?.results.contents.filter(x => x.data.range[0] <= this.other_properties_results[opr.OCCUPATION] && 
                                                                         x.data.range[1] >= this.other_properties_results[opr.OCCUPATION])[0];
        }else{
            let result = await rolltable_doc?.roll(); 
            rolled_occupation = result?.results[0];
            if (this._settings.DiceSoNiceEnabled) { game.dice3d?.showForRoll(result?.roll); }
        }

        if (rolled_occupation) { // no further rolls if no Premium Pack
            this.occupation = rolled_occupation.data.text;

            // Parse out the details
            // NOTE: This will need to be revisited if roll table "Table 1-3: Occupation" is ever changed. 
            let pattern = /(?<=<td>)(.+?)(?=<\/td>)/g;
            this.occupation_details = this.occupation.match(pattern);
            this.occupation_desc = this.occupation_details[0];  
            this.trade_weapon = this.occupation_details[1];     
            this.trade_good = this.occupation_details[2];       

            // Some of the following functions are small enough to include inline, but I think this is more readable.

            // † If a missile fire weapon (such as sling or dart), roll 1d6 to determine number of sling stones or darts.
            this.SetMissileWeaponDetails()

            // * Roll 1d8 to determine farmer type: (1) potato, (2) wheat, (3) turnip, (4) corn, (5) rice, (6) parsnip, (7) radish, (8) rutabaga.
            pattern = /\*/g;
            if (this.occupation_desc.match(pattern)) // Occupation*
            {
                this.SetFarmerType();
            }

            // ** Why did the chicken cross the hallway? To check for traps! In all seriousness, if the party includes more than one farmer or herder, randomly determine the 
            // second and subsequent farm animals for each duplicated profession with 1d6: (1) sheep, (2) goat, (3) cow, (4) duck, (5) goose, (6) mule.
            pattern = /[^\*]\*{2}$/g;
            if (this.trade_good.match(pattern)) // Trade Good**
            {
                this.SetFarmAnimal();
            } else {
                // *** Roll 1d6 to determine what’s in the cart: (1) tomatoes, (2) nothing, (3) straw, (4) your dead, (5) dirt, (6) rocks 
                pattern = /\*{3}/g;
                if (this.trade_good.match(pattern)) // Trade Good***
                {
                    this.SetCartContents()
                }
            }

            // Set Character Name - Can be changed in Configure Actor form
            this._SetCharacterName(this._character_name, this.farmer_type, this.occupation_desc)
        }
    }

    BuildDescription(){

        // Example:
        // Hit Points HP: 3 (+1) || (+Stamina Modifier)
        // Occupation: Rope maker
        // Weapon: Knife (as dagger)
        // Trade Good: Rope, 100’
        // Equipment: Lantern
        // Money: 28 cp
        // Birth Augur: Lived through famine: Fortitude saving throws (+1) || (+Luck Modifier)

        this.note += "<table>";
        this.note += "<tr>";
        this.note += "<td style=\"width: 28%;\">Hit Points:</td><td>" + this._hp_base;        
        if(this._settings.DistributionMethod === "0"){
            this.note += " (" + (this.stamina_modifier >= 0 ? "+" : "") + this.stamina_modifier + ")</td>";
        }
        else{
            this.note += " (+Stamina Modifier)";
        }
        this.note += "</tr>";

        this.note += "<tr>";
        this.note += "<td>Occupation:</td><td>" + (this.farmer_type !== "" ? this.farmer_type + " " : "") + this.occupation_desc + "</td>";
        this.note += "</tr>";

        this.note += "<tr>";
        this.note += "<td>Weapon:</td><td>";
        this.note += (this.trade_weapon.toLowerCase().includes("dart") ? this.trade_weapon_ammo_qty + "x " :""); 
        this.note += this.trade_weapon; 
        this.note += (!this.trade_weapon.toLowerCase().includes("dart") && this.trade_weapon_ammo !== "" ? " with " + this.trade_weapon_ammo_qty + " " + this.trade_weapon_ammo : "");
        this.note += "</td></tr>";

        this.note += "<tr>";
        this.note += "<td>Trade Good:</td><td>" + this.trade_good + (this.contents > 0 ? " with " + this.cart_content : "");        
        this.note += "</td></tr>";

        this.note += "<tr>";
        this.note += "<td>Equipment:</td><td>" + this.equipment;
        this.note += "</td></tr>";

        this.note += "<tr>";
        this.note += "<td>Money:</td><td>" + this._currency_cp + " cp";
        this.note += "</td></tr>";

        this.note += "<tr>";
        this.note += "<td>Birth Augur:</td><td id=\"dcc_birth_augur\">" + this.luck;
        if(this._settings.DistributionMethod === "0"){
            this.note += " (" + (this.luck_modifier >= 0 ? "+" : "") + this.luck_modifier + ")";
        }
        else{
            this.note += " (+Luck Modifier)";
        }
        this.note += "</td></tr>";
        this.note += "</table>";

        return this.note;
    }

    async RollEquipment() {
        const rolltable_doc = await this._GetDocumentFromCompendium("dcc-core-book.dcc-core-tables", "Table 3-4: Equipment"); // Premium Pack
        let rolled_equipment = null;

        if(this.other_properties_results){
            rolled_equipment = rolltable_doc?.results.contents.filter(x => x.data.range[0] <= this.other_properties_results[opr.EQUIPMENT] && 
                                                                           x.data.range[1] >= this.other_properties_results[opr.EQUIPMENT])[0];
        }else{
            let result = await rolltable_doc?.roll()
            rolled_equipment = result?.results[0]
            if (this._settings.DiceSoNiceEnabled) { game.dice3d?.showForRoll(result?.roll); }
        }

        if (rolled_equipment) {
            this.equipment = rolled_equipment.data.text.replace("&amp;", "&"); // Repalce &amp; with & - otherwise, item won't be found in equipment rolltable_doc
        }
    }

    async RollLuck() {
        const rolltable_doc = await this._GetDocumentFromCompendium("dcc-core-book.dcc-core-tables", "Table 1-2: Luck Score"); // Premium Pack
        let rolled_luck = null;

        if(this.other_properties_results){
            rolled_luck = rolltable_doc?.results.contents.filter(x => x.data.range[0] <= this.other_properties_results[opr.LUCK_STORE] && 
                                                                      x.data.range[1] >= this.other_properties_results[opr.LUCK_STORE])[0];
        }else{
            let result = await rolltable_doc?.roll();
            rolled_luck = result?.results[0];
            if (this._settings.DiceSoNiceEnabled) { game.dice3d?.showForRoll(result?.roll); }
        }

        if (rolled_luck) {
            this.luck = rolled_luck.data.text;
        }
    }

    SetMissileWeaponDetails() {
        //NOTE: There is no "dart" ammo at this time, only "Arrows" and "Sling stones"
        //      However, we still need trade_weapon_ammo_qty for "darts" 
        let pattern = /dart|sling|Shortbow/i;
        if (this.trade_weapon.match(pattern))
        {
            this.trade_weapon_ammo = (this.trade_weapon === "Shortbow" ? "Arrows" : "Sling stones");
            if(this.other_properties_results){
                this.trade_weapon_ammo_qty = this.other_properties_results[opr.AMMO_QTY];
            }else{
                this.trade_weapon_ammo_qty = this._RollDiceForTotal("1d6");
            }
        }
    }

    SetFarmerType(){
        if(this.other_properties_results){
            this.farmer_type = this.farmer_types[this.other_properties_results[opr.FARMER_TYPE] - 1];
        }else{
            const type = this._RollDiceForTotal("1d8");
            this.farmer_type = this.farmer_types[type - 1];
        }
    }

    SetFarmAnimal() {
        // First check to see if there are other farmers || herders
        const farmers = game.actors.filter(i => new RegExp(/\sFarmer\*/).test(i.data.data.details.occupation.value));
        const herders = game.actors.filter(i => i.data.data.details.occupation.value === "Herder")
        const dwarven_herders = game.actors.filter(i => i.data.data.details.occupation.value === "Dwarven herder");
        if ((farmers.length > 0 && this.occupation_desc === "Farmer*") ||
            (herders.length > 0 && this.occupation_desc === "Herder") ||
            (dwarven_herders.length > 0 && this.occupation_desc === "Dwarven herder")) {
            if (this.other_properties_results) {
                this.trade_good = this.farm_animals[this.other_properties_results[opr.FARM_ANIMAL] - 1];
            } else {
                let animal = this._RollDiceForTotal("1d6");
                this.trade_good = this.farm_animals[animal - 1];
            }
        }
    }

    SetCartContents() {
        if (this.other_properties_results) {
            this.contents = this.other_properties_results[opr.CART_CONTENTS]
            this.cart_content = this.cart_contents[this.other_properties_results[opr.CART_CONTENTS] - 1];
        } else {
            this.contents = this._RollDiceForTotal("1d6");
            this.cart_content = this.cart_contents[this.contents - 1];
        }
    }

    // OVERRIDES
    _RollBaseHitPoints(formula){
        if(this.other_properties_results){
            this._hp_base = this.other_properties_results[opr.HITPOINTS];
        }else{
            this._hp_base = super._RollDiceForTotal(formula);
        }
        return this._hp_base;
    }

    _RollStartingMoney(formula, type){
        if(this.other_properties_results){
            this._currency_cp = this.other_properties_results[opr.STARTING_MONEY];
        }else{
            this._currency_cp = super._RollStartingMoney(formula, type);
        }
        return this._currency_cp;
    }

    async _SetCharacterName(character_name, farmer_type, occupation_desc) {

        if (character_name === "New Actor") {            
            switch (this._settings.NameFormat) {
                case "0":
                    // Player (Occupation)
                    this._character_name = game.users.get(this._owner_id)?.name + " (" + (farmer_type !== "" ? farmer_type + " " : "") + occupation_desc + ")"
                    break;
                case "1":
                    // Occupation (Player)
                    this._character_name = (farmer_type !== "" ? farmer_type + " " : "") + occupation_desc + " (" + game.users.get(this._owner_id)?.name + ")"
                    break;
                case "2":
                    // Occupation
                    this._character_name = (farmer_type !== "" ? farmer_type + " " : "") + occupation_desc;
                    break;
                case "3":
                    // Random name from "Appendix S: Sobriquets"
                    const rolltable_doc = await this._GetDocumentFromCompendium("dcc-core-book.dcc-core-tables", "Appendix S: Sobriquets"); // Premium Pack
                    let result = await rolltable_doc?.roll();
                    let rolled_names = result?.results[0];
                    if(rolled_names){
                        //if (this._settings.DiceSoNiceEnabled) { game.dice3d?.showForRoll(result?.roll); }
                        // Parse out the names
                        let pattern = /(?<=<td>)(.+?)(?=<\/td>)/g;
                        let name_list = rolled_names.data.text.match(pattern);
                        let name_id = this._RollDiceForTotal("1d4", true);
                        this._character_name = name_list[name_id - 1];// Pick from Random Column
                    }
                    else // Premium pack not installed - Maybe provide a list of random names not found in premium pack? User custom names list?
                    {// Make my own random name generator maybe ???
                        this._character_name = "No Random Name Choices";
                    }
                    break;
                default:
                    this._character_name = "New DCC Actor";
            }
        }
        else { this._character_name = character_name; }
    }

    async _Update(data) {
        
        // Embed items
        // Trade Weapon
        if(data.dcc_trade_weapon.toLowerCase().includes("dart")){
            for(let i = 0; i < data.dcc_trade_weapon_ammo_qty; i += 1){
                this._EmbedWeaponItem("dcc-core-book.dcc-core-occupation-items", data.dcc_trade_weapon, 1, data.agl_modifier, ""); // Weapon - Premium Pack
            }
        }
        else if(this.missile_weapons.includes(data.dcc_trade_weapon)){
            // Missile fire Weapon
            this._EmbedWeaponItem("dcc-core-book.dcc-core-occupation-items", data.dcc_trade_weapon, 1, data.agl_modifier, ""); // Weapon - Premium Pack
            // Ammo
            this._EmbedItem("dcc-core-book.dcc-core-ammunition", data.dcc_trade_weapon_ammo, data.dcc_trade_weapon_ammo_qty); // Ammo - Premium Pack
        }        
        else{
            // Weapon is not dart|sling|Shortbow
            this._EmbedWeaponItem("dcc-core-book.dcc-core-occupation-items", data.dcc_trade_weapon, 1, data.str_modifier, data.str_modifier); // Weapon - Premium Pack
        }

        // Trade Good
        this._EmbedItem("dcc-core-book.dcc-core-occupation-items", data.dcc_trade_good); // Trade Good - Premium Pack

        // Farm Animal
        if(data.dcc_farm_animal !== ""){
            this._EmbedItem("dcc-core-book.dcc-core-occupation-items", data.dcc_farm_animal); // Trade Good - Premium Pack
        }

        // Cart contents
        if(data.dcc_cart_content !== ""){
            this._EmbedItem("dcc-core-book.dcc-core-occupation-items", data.dcc_cart_content); // Trade Good - Premium Pack
        }

        // Equipment
        this._EmbedItem("dcc-core-book.dcc-core-equipment", data.dcc_equipment); // Premium Pack

        // Set name
        if(data.character_name === "New Actor"){
            this._SetCharacterName(data.character_name, data.dcc_farmer_type, data.dcc_occupation_desc);
        }else{this._character_name = data.character_name;}

        // UPDATE
        const hit_points = Math.max(parseInt(data.hp_base) + parseInt(data.hp_modifier), 1);
        await this._actor.update({
            'name': this._character_name,
            'data.attributes.hp.value': hit_points,
            'data.attributes.hp.max': hit_points,
            'data.attributes.ac.value':10 + parseInt(data.agl_modifier),
            'data.attributes.init.value':data.agl_modifier,
            'data.currency.cp': this._actor.data.data.currency.cp + data.currency_cp,
            'data.saves.frt.value':data.sta_modifier,
            'data.saves.ref.value':data.agl_modifier,
            'data.saves.wil.value':data.per_modifier,
            'data.abilities.str.value': data.str_final_score_display,
            'data.abilities.agl.value': data.agl_final_score_display,
            'data.abilities.sta.value': data.sta_final_score_display,
            'data.abilities.per.value': data.per_final_score_display,
            'data.abilities.int.value': data.int_final_score_display,
            'data.abilities.lck.value': data.lck_final_score_display,
            'data.abilities.str.max': data.str_final_score_display,
            'data.abilities.agl.max': data.agl_final_score_display,
            'data.abilities.sta.max': data.sta_final_score_display,
            'data.abilities.per.max': data.per_final_score_display,
            'data.abilities.int.max': data.int_final_score_display,
            'data.abilities.lck.max': data.lck_final_score_display,
            'data.details.occupation.value': (data.dcc_farmer_type ? data.dcc_farmer_type + " " : "") + data.dcc_occupation_desc,
            'data.details.notes.value': data.dcc_description,
            'data.details.birthAugur': data.dcc_luck
        });
    }
}
