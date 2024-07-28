import { base_ActorHelper } from './_base-actor-helper.js';

// OPR_CONSTANTS
const opr = {}

export default class osric_ActorHelper extends base_ActorHelper {

    // base property overrides

    // game system unique properties

    constructor(actor, other_properties_results, owner_id) {
        super(actor, other_properties_results, owner_id);
    }

    // UNIQUE DATA

    // OVERRIDES
    async _Update(data) {
        // _final_score_display includes Racial Mod - will revisit this when dnd5e implements race items (see pf1).
        await this._actor.update({
            'system.details.race': data.select_race,
            'system.abilities.str.value': data.str_final_score_display,
            'system.abilities.dex.value': data.dex_final_score_display,
            'system.abilities.con.value': data.con_final_score_display,
            'system.abilities.int.value': data.int_final_score_display,
            'system.abilities.wis.value': data.wis_final_score_display,
            'system.abilities.cha.value': data.cha_final_score_display
        });
    }

}