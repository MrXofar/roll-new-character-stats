import { base_ActorHelper } from './_base-actor-helper.js';
export default class archmage_ActorHelper extends base_ActorHelper {
    
    // OPR_CONSTANTS
    
    // base property overrides

    // game system unique properties

    constructor(actor, other_properties_results, owner_id) {
        super(actor, other_properties_results, owner_id);
    }

   // UNIQUE DATA

   // OVERRIDES
    async _Update(data){
        await this._actor.update({
            'data.abilities.str.value': data.str_final_score_display,
            'data.abilities.dex.value': data.dex_final_score_display,
            'data.abilities.con.value': data.con_final_score_display,
            'data.abilities.int.value': data.int_final_score_display,
            'data.abilities.wis.value': data.wis_final_score_display,
            'data.abilities.cha.value': data.cha_final_score_display
        });
    }

}