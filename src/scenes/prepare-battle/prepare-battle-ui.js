import ECS from "./../../lib/ecs-helper"

/** 
 * @typedef {Object} squad
 * @property {number} squadId Squad entity id
 * @property {string} desc Squad description
 * @property {number} number Squad number
 * @property {boolean} placing Placing squad ?
 * @property {number[]} units Squad unit entities
 */


/**
 * @typedef DataUI
 * @type {object}
 * @property {ECS} ecs
 * @property {Phaser.Scene} scene
 * @property {number} placingSquadId
 * @property {squad[]} squads
 * @property {boolean} battleReady
 * @property {boolean} canConfirm
 */


 /** @type {DataUI} */
const data = {
    ecs: undefined,
    scene: undefined, 
    placingSquadId: undefined,
    squads: [],
    battleReady: false,
    canConfirm: false
}



const PrepareBattleUI = {

    /**
     * @param {squad} squad
     */
    onConfirmButtonClick: (squad) => {

        data.placingSquadId = undefined
        data.canConfirm = false
        data.battleReady = true
        data.ecs.set(true, squad.squadId, "squad", "placed")

        m.redraw()
    },


    onToBattleClick: () => {
        data.scene.scene.start("Battle")
    },

    onPlaceButtonClick: (squad) => {
        data.placingSquadId = squad.squadId
        
        m.redraw()  
    },

    setCanConfirm: (confirm) => {
        data.canConfirm = confirm
        m.redraw()  
    },

    oninit: () => {

    },

    getPlacingSquadId: () => {
        return data.placingSquadId
    },

    setSquads: (squads) => {
        data.squads = squads
        
        m.redraw()  
    },

    setECS: (ecs) => {
        data.ecs = ecs
    },

    setScene: (scene) => {
        data.scene = scene
    },


    confirmButtonClass: (squad) => {
        let elClass = []

        if (data.placingSquadId !== squad.squadId) {
            elClass.push("hidden")
        }
        if (!data.canConfirm) {
            elClass.push("pure-button-disabled")
        }
        return elClass.join(" ")
    },

    view: (vnode) => {
        return m(".right-panel", [
            m("h2", "Squads"),

            //Title for placing squad, canceling and validating
            m("h3", {
                class: data.placingSquadId === undefined ? "hidden" : "",
            }, "Placing squad " + data.placingSquadId),

            //Squad list
            m("div", data.squads.map(squad => 
                m("p", [
                    m("span", squad.desc + " (" + squad.units.length + " units)"),
                    m("br"),
                    m("button.pure-button", {
                        class: data.placingSquadId !== undefined ? "pure-button-disabled" : "",
                        onclick: () => PrepareBattleUI.onPlaceButtonClick(squad)
                    }, "Place"),
                    m("button.pure-button", {
                        class: PrepareBattleUI.confirmButtonClass(squad),
                        onclick: () => PrepareBattleUI.onConfirmButtonClick(squad)
                    }, "Confirm")
                ])
            )),

            m("div", [
                m("button.pure-button", {
                    class: data.battleReady ? "" : "pure-button-disabled",
                    onclick: () => PrepareBattleUI.onToBattleClick()
                }, "To battle !")
            ])
        ])
    }

}

export default PrepareBattleUI