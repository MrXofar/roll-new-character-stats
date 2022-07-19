import { base_ActorHelper } from './_base-actor-helper.js';
export default class ose_ActorHelper extends base_ActorHelper {
    
    // OPR_CONSTANTS
    
    // base properties

    // game system unique properties

    constructor(actor, other_properties_results) {
        super(actor, other_properties_results);
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
            'data.scores.cha.value': data.cha_final_score_display,
            'data.scores.str.bonus': data.str_modifier,
            'data.scores.dex.bonus': data.dex_modifier,
            'data.scores.con.bonus': data.con_modifier,
            'data.scores.int.bonus': data.int_modifier,
            'data.scores.wis.bonus': data.wis_modifier,
            'data.scores.cha.bonus': data.cha_modifier
        });
    }

}