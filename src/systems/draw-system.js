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

        this.ecs.drawMapEntity()

    }

    drawActors(scene) {

        this.ecs.actors.forEach(id => this.ecs.drawPositionEntity(id))

    }

    update() {

        this.drawMap()
        this.drawActors()
        
    }
}