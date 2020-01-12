import ECS from "./../../lib/ecs-helper"
import PrepareBattleUI from "./../../scenes/prepare-battle/prepare-battle-ui";
import SceneBase from "../scene-base"


export default class PrepareBattle extends SceneBase {

    /**
     * 
     * @param {ECS} ecs 
     * @param {object} systems 
     */
    constructor(ecs, systems) {
        super({
            key: "PrepareBattle",
            ecs,
            systems,
            ui: PrepareBattleUI
        })
    }

    /**
     * Create scene entity and UI
     */
    create() {
        this.createSceneEntity()
        this.createUI()
    }

    /**
     * Create scene entity
     */
    createSceneEntity() {
        this.ecs.createFromAssemblage({
            components: ["prepareBattle"],
            alias: "PrepareBattle"
        })
    }

    /**
     * Create DOM
     */
    createUI() {

        this.ui.init(this.ecs)

        m.mount(document.getElementById("ui"), this.ui)

    }

    update() {
        this.systems.draw.update()
        this.systems.input.update()

        this.ui.redraw()
    }
}