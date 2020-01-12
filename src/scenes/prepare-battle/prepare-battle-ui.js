import ECS from "./../../lib/ecs-helper"
import { PrepareBattleComponent } from "../../components/components"

 /** @type {ECS */
 let ecs

 /** @type {PrepareBattleComponent} */
let prepareBattle 

const PrepareBattleUI = {

    init(ecsParam) {
        ecs = ecsParam

        prepareBattle = ecs.get("PrepareBattle", "prepareBattle")
    },

    /**
     * @param {squad} squad
     */
    onConfirmButtonClick: (squad) => {

        prepareBattle.placingSquadId = undefined
        prepareBattle.canConfirm = false
        prepareBattle.battleReady = true

    },


    onToBattleClick: () => {
        ecs.scene.scene.start("Battle")
    },

    onPlaceButtonClick: (squadId) => {
        prepareBattle.placingSquadId = squadId
    },

    redraw() {
        m.redraw()
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


                let confirmClass = ""

                if (prepareBattle.placingSquadId === squadId) {
                    if (!prepareBattle.canConfirm) {
                        confirmClass = "pure-button-disabled"
                    }
                }
                else {
                    confirmClass = "hidden"
                }

                return m("p", [
                    m("span", squad.desc + " (" + units.length + " units)"),
                    m("br"),

                    //Place squad button :
                    m("button.pure-button", {
                        class: prepareBattle.placingSquadId !== undefined ? "pure-button-disabled" : "",
                        onclick: () => PrepareBattleUI.onPlaceButtonClick(squadId)
                    }, "Place"),

                    //Confirm place button :
                    m("button.pure-button", {
                        class: confirmClass,
                        onclick: () => PrepareBattleUI.onConfirmButtonClick(squad)
                    }, "Confirm")
                ])
            })),

            m("div", [
                m("button.pure-button", {
                    class: prepareBattle.battleReady ? "" : "pure-button-disabled",
                    onclick: () => PrepareBattleUI.onToBattleClick()
                }, "To battle !")
            ])
        ])
    }

}

export default PrepareBattleUI