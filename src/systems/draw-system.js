import ECS from "../lib/ecs-helper";

export default class DrawSystem {

    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }


    drawMap() {
        this.ecs.drawMapEntity()
    }

    drawActors() {
        this.ecs.actors.forEach(id => this.ecs.drawPositionEntity(id))
    }

    drawError() {
       // this.ecs.drawSquare()
    }

    update() {

        switch(this.ecs.sceneKey) {

            case "PrepareBattle":
                this.drawMap()
                this.drawActors()
                this.drawError()
                break

            case "Battle":
                const battle = this.ecs.get("Battle", "battle")

                if (!battle.drawn) {
                    this.drawMap()
                    this.drawActors()
                }

                break
                

        }


        
    }
}