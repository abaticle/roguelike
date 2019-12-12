export default class BattleSceneUI {

    /**
     * 
     * @param {BattleScene} scene 
     * @param {ECS} ecs
     */
    constructor(scene, ecs) {
        this.scene = scene
        this.ecs = ecs

        this.state = {
            entityId: undefined,
            health: 0,
            desc: "",
            x: 0,
            y: 0,
            actions: [],
            selection: undefined
        }

        m.mount(document.getElementById("ui"), this)
    }


    setEntityId(entityId) {
        this.state.entityId = entityId
    }

    view() {        
        return m(".right-panel", [
            m("button", {
                onclick: () => {
                    this.scene.turn()
                }
            }, "Next turn"),
            
            m("div", [
                m("table.pure-table", {
                    class: this.state.entityId === undefined ? "hidden" : ""
                }, [
                    m("tr", [
                        m("td", "Unit"), 
                        m("td", this.state.desc)
                    ]),
                    m("tr", [
                        m("td", "Health"), 
                        m("td", this.state.health)
                    ]),
                    m("tr", [
                        m("td", "X"), 
                        m("td", this.state.x)
                    ]),
                    m("tr", [
                        m("td", "Y"), 
                        m("td", this.state.y)
                    ])
                ])
            ])
            /*m("button", {
                onclick: () => {
                    this.scene.step()
                }
            }, "Step"),
            m("ul", this.actions.map(action => {
                return m("li", action.description)
            }))*/
        ]) 
    }

    update() {
        this.updateUnit()
    }

    updateUnit() {

        if (this.state.selection) {
            this.state.selection.destroy()
        }

        if (this.state.entityId !== undefined) {

            const {
                actor,
                position
            } = this.ecs.get(this.state.entityId)
   
            this.state.health = actor.health
            this.state.desc = actor.desc

            this.state.selection = this.scene.add.rectangle((position.x * 32) + 16, (position.y * 32) + 16, 32, 32).setStrokeStyle(2, 0xffff00)            
        }

        m.redraw()  
    }


    updateActions(actions) {
        this.actions = [...actions]
    }

}