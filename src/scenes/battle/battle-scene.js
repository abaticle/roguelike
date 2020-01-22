import ECS from "../../lib/ecs-helper"
import BattleSceneUI from "./battle-scene-ui"
import SceneBase from "../scene-base"
import m from "mithril"
import config from "../../config"

export default class BattleScene extends SceneBase {

    /**
     * 
     * @param {ECS} ecs 
     * @param {object} systems 
     */
    constructor(ecs, systems) {
        super({
            key: "Battle",
            ecs,
            systems,
            ui: BattleSceneUI
        })
    }

    create() {
        this.createSceneEntity()
        this.createUI()

        //this.ecs.scene.cameras.main.zoom = 1.5

        //this.input.on('pointerdown', this.onPointerdown.bind(this))
        //this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this.onKeyboardDown.bind(this));
    }


    createSceneEntity() {
        this.ecs.createFromAssemblage({
            components: ["battle"],
            alias: "Battle",
            data: {
                battle: {
                    newTurn: false,
                    speed: 1,
                    turn: 0,
                    actions: [],
                    drawn: false                    
                }
            }
        })
    }

    createUI() {
        this.ui.init(this.ecs)

        m.mount(document.getElementById("ui"), this.ui)
    }


    onPointerdown(pointer) {
        const entityId = this.ecs.getEntityAtMousePosition(pointer, true)
        const ui = this.ecs.get("Battle", "battle", "ui")

        ui.setEntityId(entityId)

    }

    onKeyboardDown(event) {
        switch (event.code) {
            case "Numpad1":
                break
            case "Numpad2":
                break
            case "Numpad3":
                break
            case "Numpad4":
                break
            case "Numpad5":
                break
            case "Numpad6":
                break
            case "Numpad7":
                break
            case "Numpad8":
                break
            case "Numpad9":
                break
        }
    }

    update(dt) {
        
        this.systems.draw.update()
        this.systems.input.update()
        this.systems.turn.update()        
        this.systems.animation.update(dt)
        this.ui.redraw()
        
    }
}
