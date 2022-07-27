export const settingsKey = "roll-new-character-stats";

export class RegisteredSettings{
    constructor(){}    
    NumberOfActors = game.settings.get(settingsKey, "NumberOfActors");
    DiceSoNiceEnabled = game.settings.get(settingsKey, "DiceSoNiceEnabled");
    NameFormat = game.settings.get(settingsKey, "NameFormat");
    AbilitiesRollMethod = game.settings.get(settingsKey, "AbilitiesRollMethod");
    DropLowestDieRoll = game.settings.get(settingsKey, "DropLowestDieRoll");
    ReRollOnes = game.settings.get(settingsKey, "ReRollOnes");
    NumberOfSetsRolled = game.settings.get(settingsKey, "NumberOfSetsRolled");
    DropLowestSet = game.settings.get(settingsKey, "DropLowestSet");
    BonusPoints = game.settings.get(settingsKey, "BonusPoints");
    Over18Allowed = game.settings.get(settingsKey, "Over18Allowed");
    // DistributeResults = game.settings.get(settingsKey, "DistributeResults");
    DistributionMethod = game.settings.get(settingsKey, "DistributionMethod");
    HideResultsZone = game.settings.get(settingsKey, "HideResultsZone");
    ChatRemoveConfigureActorButton = game.settings.get(settingsKey, "ChatRemoveConfigureActorButton");
    ChatShowDescription = game.settings.get(settingsKey, "ChatShowDescription");
    ChatShowMethodText = game.settings.get(settingsKey, "ChatShowMethodText");
    ChatShowResultsText = game.settings.get(settingsKey, "ChatShowResultsText");
    ChatShowCondensedResults = game.settings.get(settingsKey, "ChatShowCondensedResults");
    ChatShowBonusPointsText = game.settings.get(settingsKey, "ChatShowBonusPointsText");
    ChatShowDifficultyText = game.settings.get(settingsKey, "ChatShowDifficultyText");
    ChatShowNoteFromDM = game.settings.get(settingsKey, "ChatShowNoteFromDM");
}