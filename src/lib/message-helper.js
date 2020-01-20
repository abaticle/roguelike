import ECS from "./ecs"
import ECSHelper from "./ecs-helper"
import Utils from "./../other/utils"

export default class MessageHelper {
    
    /**
     * 
     * @param {ECSHelper} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }

    
    /**
     * 
     * @param {MoveMessage|AttackMeleeMessage|AttackRangedMessage|DieMessage} message 
     */
    pushMessage(message) {
        const actions = this.ecs.get("Battle", "battle", "actions")
        
        actions.push(message)
    }


    

    /**
     * Move an entity
     * @param {*} entityId Entity to move
     * @param {MapPosition} nextPosition Next position, with X/Y values 
     */
    createMoveMessage(entityId, nextPosition) {
                
        //Update entity position
        const position = this.ecs.get(entityId, "position")

        const description = `Entity ${entityId} move from [${position.x},${position.y}] to [${nextPosition.x},${nextPosition.y}]`

        

        this.pushMessage({
            type: "move",
            entityId,
            currentPosition: {
                x: position.x,
                y: position.y
            },
            nextPosition,
            description
        })

        
        position.x = nextPosition.x 
        position.y = nextPosition.y
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
            damages: damages,
            description: `Entity ${entityId} did ${damages} melee damages to ${targetEntityId}`
        })
        
        //Remove health from target entity, and send die message if dead
        const targetActor = this.ecs.get(targetEntityId, "actor")

        targetActor.health -= damages

        if (targetActor.health <= 0) {

            this.pushMessage({
                type: "die",
                entityId: targetEntityId,
                killedBy: entityId,
                damages: damages,
                description: `Entity ${targetEntityId} died !`
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
            damages: damages,
            description:  `Entity ${entityId} did ${damages} ranged damages to ${targetEntityId}`
        })

        //Remove health from target entity, and send die message if dead
        const targetActor = this.ecs.get(targetEntityId, "actor")

        targetActor.health -= damages

        if (targetActor.health <= 0) {

            this.pushMessage({
                type: "die",
                entityId: targetEntityId,
                killedBy: entityId,
                damages: damages,
                description: `Entity ${targetEntityId} died !`
            })            

        }        
    }

}