import { base_ActorHelper } from './_base-actor-helper.js';
export default class dnd5e_ActorHelper extends base_ActorHelper {

    // OPR_CONSTANTS
    
    // base properties

    // game system unique properties

    constructor(actor, other_properties_results) {
        super(actor, other_properties_results);
    }

    // UNIQUE DATA

    // OVERRIDES
    async _Update(data) {

        // _final_score_display includes Racial Mod - will revisit this when dnd5e implements race items (see pf1).
        await this._actor.update({
            'data.details.race': data.select_race,
            'data.abilities.str.value': data.str_final_score_display,
            'data.abilities.dex.value': data.dex_final_score_display,
            'data.abilities.con.value': data.con_final_score_display,
            'data.abilities.int.value': data.int_final_score_display,
            'data.abilities.wis.value': data.wis_final_score_display,
            'data.abilities.cha.value': data.cha_final_score_display
        });
    }
}