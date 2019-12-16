import ECS from "../../lib/ecs";

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
            squadId: undefined,
            health: 0,
            desc: "",
            x: 0,
            y: 0,
            actions: [],
            selection: undefined,
            squadDesc: "",
            squadNumber: 0,
            selectionUnit: undefined,
            selectionSquad: []
        }

        m.mount(document.getElementById("ui"), this)
    }


    setEntityId(entityId) {
        this.state.entityId = entityId
        this.updateUnit()
    }

    view() {        
        return m(".right-panel", [
            m("button", {
                onclick: () => { this.onNewTurnClick() }
            }, "Next turn"),
            
            m("div", [
                m("table.pure-table", {
                    class: this.state.entityId === undefined ? "hidden" : ""
                }, [
                    m("tr", [
                        m("td", "Squad"), 
                        m("td", this.state.squadDesc)
                    ]),
                    m("tr", [
                        m("td", "Number"), 
                        m("td", this.state.squadNumber)
                    ])
                ])
            ]),

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

    onNewTurnClick() {
        this.ecs.set(true, "Battle", "battle", "newTurn")
    }

    update() {
        this.updateUnit()
    }


    removeSelections() {
        if (this.state.selectionUnit) {
            this.state.selectionUnit.destroy()
        }

        if (this.state.selectionSquad.length > 0) {
            this.state.selectionSquad.forEach(selection => selection.destroy())
        }
    }

    updateUnit() {

        const state = this.state

        this.removeSelections()

        if (state.entityId !== undefined) {

            const {
                actor,
                display
            } = this.ecs.get(state.entityId)
            

            //Unit infos
            state.health = actor.health
            state.desc = actor.desc
            state.squadId = actor.squadId    
            
            //Unit selection
            state.selectionUnit = this.scene.add.rectangle(0,0,32,32).setStrokeStyle(2, 0xffff00)               
            display.container.add(state.selectionUnit)


            //Squad infos :
            const squad = this.ecs.get(actor.squadId)

            state.squadDesc = this.ecs.get(actor.squadId, "squad", "desc")
            state.squadNumber = this.ecs.get(actor.squadId, "squad", "number")

            this.ecs.searchEntities("actor").forEach(entityId => {

                if (entityId !== state.entityId) {
                    
                    const entity = this.ecs.get(entityId)

                    const actor = this.ecs.get(entityId, "actor")

                    if (actor.squadId === state.squadId) {
                        let rectangle = this.scene.add.rectangle(0,0,32,32).setStrokeStyle(.5   , 0xfff000)

                        entity.display.container.add(rectangle)
                        this.state.selectionSquad.push(rectangle)
                    }
                }
                
                
            });
            
        }

        m.redraw()  
    }


    updateActions(actions) {
        this.actions = [...actions]
    }

}