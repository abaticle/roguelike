import ECS from "./ecs"
import ECSHelper from "./ecs-helper"

export default class MessageHelper {
    
    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
        this.ecsHelper = new ECSHelper(ecs)
    }


    pushMessage(message) {
        const actions = this.ecs.get("Game", "game", "actions")

        actions.push(message)
    }


    /**
     * Move an entity
     * @param {*} entityId Entity to move
     * @param {position} nextPosition Next position, with X/Y values 
     */
    createMoveMessage(entityId, nextPosition) {
        
        //Update entity position
        const position = this.ecs.get(entityId, "position")

        this.ecsHelper.setWalkable(position.x, position.y, true)

        position.x = nextPosition.x
        position.y = nextPosition.y

        this.ecsHelper.setWalkable(position.x, position.y, false)

        this.pushMessage({
            type: "move",
            entityId,
            nextPosition
        })
    }


    /**
     * Melee attack
     * @param {number} entityId 
     * @param {number} targetEntityId 
     */
    createAttackMelee(entityId, targetEntityId) {

        //TODO:Calculate damages from strength ?
        let damages = 10


        //Push melee attack message
        this.pushMessage({
            type: "attackMelee",
            from: entityId,
            to: targetEntityId,
            damages: damages
        })

        
        //Remove health from target entity, and send die message if dead
        const targetActor = this.ecs.get(targetEntityId, "actor")

        targetActor.health -= damages

        if (targetActor.health <= 0) {

            this.pushMessage({
                type: "die",
                from: targetEntityId
            })            

        }
    }

    createAttackRanged(entityId, targetEntityId) {

    }

    createDieMessage(entityId) {
        this.pushMessage({
            type: "die",
            from: entityId
        })
    }

}