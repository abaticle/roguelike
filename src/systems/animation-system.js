import ECSHelper from "../lib/ecs-helper"

export default class AnimationSystem {

    /**
     * 
     * @param {ECSHelper} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }


    /**
     * Move animation
     * @param {number} dt 
     * @param {MoveMessage} message 
     */
    animateMove(dt, message) {


        let {
            entityId,
            nextPosition
        } = message
        
        let {
            position, 
            display
        } = this.ecs.get(entityId)

        if (position.x === nextPosition.x && position.y === nextPosition.y) {

        }

        else {
            
        }

    }

    /**
     * 
     * @param {number} dt 
     */
    update(dt) {

        this.ecs.actions.forEach(action => {

            switch(action.type) {
                case "die":
                    break

                case "attackMelee":
                    break

                case "move":
                    this.animateMove(dt, action)
                    break

                case "attackRanged":
                    break
            }

        })


        this.ecs.actors.map(id => this.ecs.get(id)).forEach(data => {

            const {
                position 
            } = data

            
        })
    }
}