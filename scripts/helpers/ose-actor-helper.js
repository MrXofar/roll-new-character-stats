import { base_ActorHelper } from './_base-actor-helper.js';
export default class ose_ActorHelper extends base_ActorHelper {
    
    // OPR_CONSTANTS
    
    // base properties

    // game system unique properties

    constructor(actor, other_properties_results, owner_id) {
        super(actor, other_properties_results, owner_id);
    }

   // UNIQUE DATA

   // OVERRIDES
    async _Update(data){
        await this._actor.update({
            'data.scores.str.value': data.str_final_score_display,
            'data.scores.dex.value': data.dex_final_score_display,
            'data.scores.con.value': data.con_final_score_display,
            'data.scores.int.value': data.int_final_score_display,
            'data.scores.wis.value': data.wis_final_score_display,
            'data.scores.cha.value': data.cha_final_score_display
        });
    }

}