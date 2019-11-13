import ECS from "./ecs"
import ECSHelper from "./ecs-helper"
import Utils from "./../other/utils"

export default class MessageHelper {
    
    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
        this.ecsHelper = new ECSHelper(ecs)
    }

    
    /**
     * 
     * @param {MoveMessage|AttackMeleeMessage|AttackRangedMessage} message 
     */
    pushMessage(message) {
        const actions = this.ecs.get("Game", "game", "actions")
        
        actions.push(message)
    }

    /**
     * Move an entity
     * @param {*} entityId Entity to move
     * @param {Position} nextPosition Next position, with X/Y values 
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

        //TODO:Calculate damages from strength for melee attack ?
        let damages = Utils.randomInteger(4, 8)

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
                from: targetEntityId,
                killedBy: entityId,
                damages: damages
            })            

        }
    }

    /**
     * Ranged attack
     * @param {number} entityId 
     * @param {number} targetEntityId 
     */
    createAttackRanged(entityId, targetEntityId) {

        //TODO:Calculate damages from strength for ranged attack ?
        let damages = Utils.randomInteger(2, 6)

        //Push ranged attack message
        this.pushMessage({
            type: "attackRanged",
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
                from: targetEntityId,
                killedBy: entityId,
                damages: damages
            })            

        }        
    }

    createDie(entityId) {
        this.pushMessage({
            type: "die",
            from: entityId
        })
    }

}