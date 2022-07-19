
import GAME_SYSTEM_Helper from "../../data/game-system-helper.js";
import { RegisteredSettings } from "../registered-settings.js";

export class base_ActorHelper {

    // Base Properties
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

    constructor(actor, other_properties_results) {
        this._actor = actor;
        this.other_properties_results = other_properties_results;
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

    _RollDiceForTotal(formula) {
        let roll = new Roll(formula);
        let total = roll.evaluate({ async: false }).total;
        if (this._settings.DiceSoNiceEnabled) { game.dice3d?.showForRoll(roll); }
        return total;
    }

    async _EmbedItem(pack_id, item_name, qty) {
        //console.log("pack: " + pack_id + ", " + "item_name: " + item_name);
        qty = (qty === 0 ? 1 : qty);
        const pack = game.packs.get(pack_id);
        //console.log(pack);
        const itemId = pack?.index.getName(item_name)?._id;
        //console.log(itemId);
        // Nothing will become embedded if the pack is not present
        if (itemId) {
            const _item = await pack.getDocument(itemId);            
            //console.log(_item);
            const obj_item = _item.data.toObject();
            //console.log(obj_item);
            obj_item.data.quantity = qty;
            await this._actor.createEmbeddedDocuments("Item", [obj_item]);
        }
    }

    async _Update(data){
        await this._actor.update({data});
    }
}
