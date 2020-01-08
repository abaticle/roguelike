import ECS from "./../../lib/ecs-helper"

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
    squads: [],
    battleReady: false,
    canConfirm: false
}


const getSquads = () => {

    return ecs.getTeamSquads(ecs.player).map(squadId => {
        return {
            squad: ecs.get(squadId, "squad"),
            units: ecs.getSquadUnits(squadId).map(id => ecs.get(id, "actor"))
        }
    })

}


const PrepareBattleUI = {

    setECS(ecsParam) {
        ecs = ecsParam
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
                class: data.placingSquadId === undefined ? "hidden" : "",
            }, "Placing squad " + data.placingSquadId),

            //Squad list
            m("div", getSquads().map(squadData => {

                const {
                    squad,
                    units
                } = squadData

                return m("p", [
                    m("span", squad.desc + " (" + units.length + " units)"),
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