import ECS from "./../../lib/ecs-helper"
import { PrepareBattleComponent } from "../../components/components"

 /** @type {ECS */
 let ecs

 /** @type {Phaser.Scene} */
 let scene

/**
 * @typedef DataUI
 * @type {DataUI}
 * @property {number} placingSquadId
 * @property {squad[]} squads
 * @property {boolean} battleReady
 * @property {boolean} canConfirm
 */
const data = {
    placingSquadId: undefined,
    battleReady: false,
    canConfirm: false
}


/** @type {PrepareBattleComponent} */
let prepareBattle 


const PrepareBattleUI = {

    setECS(ecsParam) {
        ecs = ecsParam

        prepareBattle = ecs.get("PrepareBattle", "prepareBattle")
    },

    setScene(sceneParam) {
        scene = sceneParam
    },

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
        ecs.scene.start("Battle")
    },

    onPlaceButtonClick: (squadId) => {
        prepareBattle.placingSquadId = squadId
        
        m.redraw()  
    },

    setCanConfirm: (confirm) => {
        data.canConfirm = confirm
        m.redraw()  
    },

    getPlacingSquadId: () => {
        return data.placingSquadId
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
                class: prepareBattle.placingSquadId === undefined ? "hidden" : "",
            }, "Placing squad " + prepareBattle.placingSquadId),

            //Squad list
            m("div", ecs.playerSquads.map(squadId => {

                const squad = ecs.get(squadId, "squad")
                const units = ecs.getSquadUnits(squadId)

                return m("p", [
                    m("span", squad.desc + " (" + units.length + " units)"),
                    m("br"),
                    m("button.pure-button", {
                        class: prepareBattle.placingSquadId !== undefined ? "pure-button-disabled" : "",
                        onclick: () => PrepareBattleUI.onPlaceButtonClick(squadId)
                    }, "Place"),
                    m("button.pure-button", {
                        class: PrepareBattleUI.confirmButtonClass(squad),
                        onclick: () => PrepareBattleUI.onConfirmButtonClick(squad)
                    }, "Confirm")
                ])
            })),

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