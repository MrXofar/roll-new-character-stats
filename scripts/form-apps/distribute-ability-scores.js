
Hooks.on('renderDistributeAbilityScores', () => {
  // Add dragstart listeners for each result element
  for (let i = 0; i < 6; i++) {
    const div_final_result = document.getElementById("div_final_result" + i);
    div_final_result.addEventListener("dragstart", dragstart_handler);
  }
  // Add dragstart listeners for each bonus point element
  for (let i = 0; i < 5; i++) {
    const div_bonus_result = document.getElementById("div_bonus_result" + i);
    if (div_bonus_result) {
      div_bonus_result.addEventListener("dragstart", dragstart_handler);
    }
  }
});

function dragstart_handler(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.innerText); // value of element being dragged
  ev.dataTransfer.setData("text/plain", ev.target.id);        // id of element being dragged
  ev.dataTransfer.dropEffect = "copy";
}

export class DistributeAbilityScores extends FormApplication {

  constructor(final_results, bonus_points, over18allowed, msgId) {
    super();
    //this.actor = actor,
    this.final_results = final_results,
    this.bonus_points = bonus_points,
    this.over18allowed = over18allowed,
    this.msgId = msgId
  }

  // async close() {
  //   const msg = game.messages.get(this.msgId);
  //   let content = duplicate(msg.data.content);
  //   await msg.update({content: content});
  //   super.close();
  // }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize("RNCS.dialog.results-button.distribute-results"),
      id: 'distribute-ability-scores',
      icon: 'fas fa-cogs', // Change?
      template: "./modules/roll-new-character-stats/templates/form-apps/distribute-ability-scores.html",
      height: 450,
      width: 375,
      closeOnSubmit: true,
      submitOnClose: false
    });
  }

  getData() {
    return {
      //actor: this.actor,
      final_results: this.final_results,
      bonus_points: this.bonus_points,
      over18allowed: this.over18allowed,
      msgId: this.msgId
    };
  }

  async _updateObject(event, formData) {

		let actor = await Actor.create({
			name: "New Actor",
			type: "character",
			img: "icons/svg/mystery-man.svg"
		});

    await actor.update({
      // 'name': formData.charactername,
      'data.abilities.str.value': formData.str_final_score,
      'data.abilities.dex.value': formData.dex_final_score,
      'data.abilities.con.value': formData.con_final_score,
      'data.abilities.int.value': formData.int_final_score,
      'data.abilities.wis.value': formData.wis_final_score,
      'data.abilities.cha.value': formData.cha_final_score
    });
  }
}

window.DistributeAbilityScores = DistributeAbilityScores;