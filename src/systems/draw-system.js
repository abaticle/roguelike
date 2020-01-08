import ECS from "../lib/ecs-helper";

export default class DrawSystem {

    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }


    drawMap(scene) {

    }

    drawActors(scene) {

        this.ecs.actors.forEach(id => this.ecs.drawEntity(this.ecs.scene, id))

    }

    update() {

        this.drawActors()
        
    }
}