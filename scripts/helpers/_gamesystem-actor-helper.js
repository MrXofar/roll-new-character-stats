import { base_ActorHelper } from './_base-actor-helper.js';
export default class gamesystem_ActorHelper extends base_ActorHelper {

    // OPR_CONSTANTS

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