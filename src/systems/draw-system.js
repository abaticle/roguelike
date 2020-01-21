import ECS from "../lib/ecs-helper";
import config from "../config";

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
        this.ecs.actors.forEach(id => this.ecs.drawEntity(id))
    }

    drawError() {
       // this.ecs.drawSquare()
    }

    drawActions() {

        /** @type {BattleComponent} */
        const battle = this.ecs.get("Battle", "battle")

        
        //Remove lines
        battle.lines.forEach(line => {
            line.destroy()
        })

        battle.lines = []

        //Draw lines
        battle.actions.forEach(action => {

            let from, to

            switch(action.type) {
                case "move":

                    let {
                        entityId,
                        currentPosition,
                        nextPosition
                    } = action

                    from = this.ecs.convertMapPos(currentPosition)
                    to = this.ecs.convertMapPos(nextPosition)                    

                    battle.lines.push(this.ecs.drawLine(from, to))
                    break

                case "attackMelee":

                    from = this.ecs.convertMapPos(this.ecs.get(action.from, "position"))
                    to = this.ecs.convertMapPos(this.ecs.get(action.to, "position"))

                    battle.lines.push(this.ecs.drawLine(from, to, config.COLOR_SELECTION_ERROR))
                    break

                case "attackRanged":
                    break


            }
            if (action.type === "move") {

            }
        })

        battle.actionsDrawn = true
    }

    update() {

        switch(this.ecs.sceneKey) {

            case "PrepareBattle":
                this.drawMap()
                this.drawActors()
                this.drawError()
                break

            case "Battle":

                /** @type BattleComponent */
                const battle = this.ecs.get("Battle", "battle")

                if (!battle.drawn) {
                    this.drawMap()
                    this.drawActors()

                    battle.drawn = true
                }

                if (!battle.actionsDrawn && this.ecs.get("Game", "game", "debug")) {
                    this.drawActions()
                }
                break
                

        }


        
    }
}