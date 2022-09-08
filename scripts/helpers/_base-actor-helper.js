
import GAME_SYSTEM_Helper from "../../data/game-system-helper.js";
import { RegisteredSettings } from "../registered-settings.js";

export class base_ActorHelper {

    // base property overrides
    _owner_id = null;
    _settings = new RegisteredSettings;
    _game_system_helper = new GAME_SYSTEM_Helper();
    _character_name = "New Actor";
    _hp_base = 1;
    _hp_modifier_ability = "con";
    _description = "";
    _currency_pp = 0;
    _currency_ep = 0;
    _currency_gp = 0;
    _currency_sp = 0;
    _currency_cp = 0;

    constructor(actor, other_properties_results, owner_id) {
        this._actor = actor;
        this.other_properties_results = other_properties_results;
        this._owner_id = owner_id;
    }

    _SetCharacterName(){
        return this._character_name;
    }
    
    _RollBaseHitPoints(roll_formula){
        let result = this._RollDiceForTotal(roll_formula);
        this._hp_base = result;
        return this._hp_base
    }

    _RollStartingMoney(roll_formula, type){
        const amount = this._RollDiceForTotal(roll_formula);
        switch (type) {
            case "pp":
                this._currency_pp = amount;
                break;
            case "ep":
                this._currency_ep = amount;
                break;
            case "gp":
                this._currency_gp = amount;
                break;
            case "sp":
                this._currency_sp = amount;
                break;
            case "cp":
                this._currency_cp = amount;
                break;
        }
        return amount
    }

    _RollDiceForTotal(formula, override_dicesonice) {
        let roll = new Roll(formula);
        let total = roll.evaluate({ async: false }).total;
        if (this._settings.DiceSoNiceEnabled && !override_dicesonice) { game.dice3d?.showForRoll(roll); }
        return total;
    }

    async _GetDocumentFromCompendium(pack_id, item_name){
        // Returns nothing if the pack is not present
        let pack = game.packs.get(pack_id);
        let item_id = pack?.index.getName(item_name)?._id;
        return await pack?.getDocument(item_id);
    }

    async _EmbedItem(pack_id, item_name, qty) {
        qty = (qty === 0 ? 1 : qty);
        const item_doc = await this._GetDocumentFromCompendium(pack_id, item_name);
        // Nothing will become embedded if the pack is not present
        if (item_doc) {
            const obj_item = item_doc.toObject();
            obj_item.quantity = qty;
            await this._actor.createEmbeddedDocuments("Item", [obj_item]);
        }
    }

    async _EmbedWeaponItem(pack_id, item_name, qty, hit_mod, dmg_mod) {
        // Entirely separate function from _EmbedItem is probably not necessary, but here we are - overload would have been nice, but javascript says no.
        qty = (qty === 0 ? 1 : qty);
        const item_doc = await this._GetDocumentFromCompendium(pack_id, item_name);
        // Nothing will become embedded if the pack is not present
        if (item_doc) {
            // Add weapon modifiers
            const obj_item = item_doc.toObject();
            // NOTE: This works fine for now (for dcc), but may need to be refined for other game systems in the future.
            obj_item.toHit = (hit_mod !== "0" ? hit_mod : "+0");
            obj_item.damage += (dmg_mod !== "0" ? dmg_mod : "");
            obj_item.quantity = qty;            
            await this._actor.createEmbeddedDocuments("Item", [obj_item]);
        }
    }

    async _Update(data){
        await this._actor.update({data});
    }
}
