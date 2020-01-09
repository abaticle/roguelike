import ECS from "../lib/ecs-helper"

export default class SceneBase extends Phaser.Scene {

    /**
     * 
     * @param {object} options
     * @param {string} options.key Scene key
     * @param {ECS} options.ecs ECS
     * @param {object} options.systems Systems
     */
    constructor({key, ecs, systems}) {
        super(key)

        this.key = key
        this.ecs = ecs
        this.systems = systems
    }

    /**
     * Init scene : update game with current scene
     */
    init() {        
        this.ecs.set(this, "Game", "game", "scene")
    }

}