import { base_ActorHelper } from './_base-actor-helper.js';

// OPR_CONSTANTS
const opr = {}

export default class pf1_ActorHelper extends base_ActorHelper {
    
    // base property overrides

    // game system unique properties

    constructor(actor, other_properties_results, owner_id) {
        super(actor, other_properties_results, owner_id);
    }

   // UNIQUE DATA

   // OVERRIDES
    async _Update(data){

        // TODO-LOW: Figure out how to include "flavored" pf1 races
        
        // Embed race item document
        this._EmbedItem("pf1.races", data.select_race);

        await this._actor.update({
            'data.abilities.str.value': data.str_final_score_unmod, 
            'data.abilities.dex.value': data.dex_final_score_unmod,
            'data.abilities.con.value': data.con_final_score_unmod,
            'data.abilities.int.value': data.int_final_score_unmod,
            'data.abilities.wis.value': data.wis_final_score_unmod,
            'data.abilities.cha.value': data.cha_final_score_unmod
        });
    }
}