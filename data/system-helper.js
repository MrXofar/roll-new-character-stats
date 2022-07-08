
import JSON_Helper from "./json-helper.js";

export default class SYSTEM_Helper {
    constructor() { }

    async getSystemRaces() {
        const jh = new JSON_Helper();
        const jsonDATA = await jh.getJSONData("./modules/roll-new-character-stats/data/character-properties.json");
        switch (game.system.id) {
            case "dnd5e":
                return jsonDATA.game_system[0].dnd5e.races;
            case "pf1":
                return jsonDATA.game_system[0].pf1.races;
            default:// Default to dnd5e for now
                return jsonDATA.game_system[0].dnd5e.races;
        }
    }

    async getSystemAbilities() {
        const jh = new JSON_Helper();
        const jsonDATA = await jh.getJSONData("./modules/roll-new-character-stats/data/character-properties.json");
        // console.log(jsonDATA.game_system[0]);
        switch (game.system.id) {
            case "dnd5e":
                return jsonDATA.game_system[0].dnd5e.abilities;
            case "pf1":
                return jsonDATA.game_system[0].pf1.abilities;
            default:// Default to dnd5e for now
                return jsonDATA.game_system[0].dnd5e.abilities;
        }
    }
}