export default class PrepareBattleUI {

    /**
     * 
     * @param {ECS} ecs 
     * @param {Phaser.Scene} scene 
     */
    constructor(ecs, scene) {
        this.ecs = ecs
        this.scene = scene

        this.placingSquadId = undefined
        this.squads = []

    }


    updateSquads(squads) {
        this.squads = [...squads]
        m.redraw()  
    }

    view(vnode) {

        console.log(vnode.state)

        return m(".right-panel", [
            m("h2", "Squads"),
            m("div", this.squads.map(squad => 
                m("p", [
                    m("span", squad.desc),
                    m("br"),
                    m("button.pure-button", {
                        class: this.placingSquadId !== undefined ? "pure-button-disabled" : "",
                        onclick: () => {
                            squad.placing = true
                            this.placingSquadId = squad.squadId
                        }
                    }, "Place")
                ])
            ))
        ])
    }
}