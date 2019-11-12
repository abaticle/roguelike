import ECS from "./../lib/ecs"

class AnimationSystem {

    /**
     * Class constructor
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }


    /**
     * Remove first message
     */
    shiftMessage() {
        const actions = this.ecs.get("Game", "game", "actions")

        actions.shift()
    }

    /**
     * Get game speed
     * @returns {number} Current game speed
     */
    getSpeed(speed) {
        return ecs.get("Game", "game", "speed")
    }

    /**
     * Animate movement
     * @param {MoveMessage} message Move message 
     */
    animateMove(message) {
        
        const {
            display 
        } = this.ecs.get(message.entityId, "display")        


    }

    /**
     * Animate melee movements
     * @param {AttackMeleeMessage} message Melee attack message
     */
    animateMelee(message) {
        
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

export default AnimationSystem