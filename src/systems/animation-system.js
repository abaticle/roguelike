import ECS from "./../lib/ecs"

/**
 * @typedef {object} position
 * @property {number} x X Position
 * @property {number} y Y Position
 */

/**
 * @typedef {object} MoveAction 
 * @property {string} type Type of message (move)
 * @property {number} entityId Moving entity
 * @property {position} nextPosition Target position
 */




class AnimationSystem {

    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }


    getSpeed(speed) {
        return ecs.get("Game", "game", "speed")
    }

    /**
     * @param {MoveAction} action Move message 
     */
    animateMove(action) {

        const {
            display 
        } = this.ecs.get(action.entityId, "display")

        


    }

    animateMelee() {

    }

    /**
     * @param {action.entityId} action Dieing entity
     */    
    animateDie() {

    }


    update() {
        let actions = this.ecs.get("Game", "game", "actions")


        actions.forEach(action => {
            switch (action.type) {
                case "move":
                    this.animateMove(action)
                    break

                case "attackMelee":
                    this.animateMelee(action)
                    break

                case "die":
                    this.animateDie(action)
                    break
            }
        })
    }
}