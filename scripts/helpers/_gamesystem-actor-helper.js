import { base_ActorHelper } from './_base-actor-helper.js';

// OPR_CONSTANTS
const opr = {}

export default class gamesystem_ActorHelper extends base_ActorHelper {

    // base property overrides

    // game system unique properties

    constructor(actor, other_properties_results, owner_id) {
        super(actor, other_properties_results, owner_id);
    }

    // UNIQUE DATA

    // OVERRIDES
    async _Update(data) {
        await this._actor.update({
            data
        });
    }

}