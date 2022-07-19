import { base_ActorHelper } from './_base-actor-helper.js';
export default class gamesystem_ActorHelper extends base_ActorHelper {

    // OPR_CONSTANTS

    // base properties

    // game system unique properties

    constructor(actor, other_properties_results) {
        super(actor, other_properties_results);
    }

    // UNIQUE DATA

    // OVERRIDES
    async _Update(data) {
        await this._actor.update({
            data
        });
    }

}