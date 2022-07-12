
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
            case "ose":
                return jsonDATA.game_system[0].ose.races;
            case "archmage":
                return jsonDATA.game_system[0].archmage.races;
            case "dcc":
                return jsonDATA.game_system[0].dcc.races;
            default:// Default to dnd5e for now
                return jsonDATA.game_system[0].dnd5e.races;
        }
    }

    async getSystemAbilities() {
        const jh = new JSON_Helper();
        const jsonDATA = await jh.getJSONData("./modules/roll-new-character-stats/data/character-properties.json");
        switch (game.system.id) {
            case "dnd5e":
                return jsonDATA.game_system[0].dnd5e.abilities;
            case "pf1":
                return jsonDATA.game_system[0].pf1.abilities;
            case "ose":
                return jsonDATA.game_system[0].ose.abilities;
            case "archmage":
                return jsonDATA.game_system[0].archmage.abilities;
            case "dcc":
                return jsonDATA.game_system[0].dcc.abilities;
            default:// Default to dnd5e for now
                return jsonDATA.game_system[0].dnd5e.abilities;
        }
    }
}