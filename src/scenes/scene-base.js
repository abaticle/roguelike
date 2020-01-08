export default class SceneBase extends Phaser.Scene {

    /**
     * 
     * @param {object} param0 
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