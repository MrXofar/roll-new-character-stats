import { base_ActorHelper } from './_base-actor-helper.js';

// OPR_CONSTANTS
const opr = {}

export default class ose_ActorHelper extends base_ActorHelper {
    
    // base property overrides

    // game system unique properties

    constructor(actor, other_properties_results, owner_id) {
        super(actor, other_properties_results, owner_id);
    }

   // UNIQUE DATA

   // OVERRIDES
    async _Update(data){
        await this._actor.update({
            'system.scores.str.value': data.str_final_score_display,
            'system.scores.dex.value': data.dex_final_score_display,
            'system.scores.con.value': data.con_final_score_display,
            'system.scores.int.value': data.int_final_score_display,
            'system.scores.wis.value': data.wis_final_score_display,
            'system.scores.cha.value': data.cha_final_score_display
        });
    }

}