import ECS from "../lib/ecs-helper"
import Phaser from "phaser"
//import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js"

/**
 * Base Scene class
 * @extends {Phaser.Scene}
 */
export default class SceneBase extends Phaser.Scene {

    /**
     * 
     * @param {object} options
     * @param {string} options.key Scene key
     * @param {ECS} options.ecs ECS
     * @param {object=} options.systems Systems
     * @param {object=} options.ui UI
     */
    constructor({key, ecs, systems, ui = {}}) {
        super({
            key
        })

        /** @type {string} key */
        this.key = key
        this.ecs = ecs 
        this.systems = systems
        this.ui = ui
    }

    /**
     * Init scene : update game with current scene
     */
    init() {        
        this.ecs.set(this, "Game", "game", "scene")
    }

}