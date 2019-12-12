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
     * @param {MoveMessage|AttackMeleeMessage|AttackRangedMessage} message 
     */
    pushMessage(message) {
        const actions = this.ecs.get("Battle", "battle", "actions")
        
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

        const description = `Entity ${entityId} move from [${position.x},${position.y}] to [${nextPosition.x},${nextPosition.y}]`

        this.ecs.setWalkable(position.x, position.y, true)

        position.x = nextPosition.x
        position.y = nextPosition.y


        this.ecs.searchEntities("position").forEach(e => {
            if (e !== entityId) {
                const pos = this.ecs.get(e, "position")
                if (pos.x === position.x && pos.y === position.y) {
                    console.log("error pos !")
                }
            }
        })

        this.ecs.setWalkable(position.x, position.y, false)


        this.pushMessage({
            type: "move",
            entityId,
            nextPosition,
            description
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


        const description = `Entity ${entityId} did ${damages} melee damages to ${targetEntityId}`

        //Push melee attack message
        this.pushMessage({
            type: "attackMelee",
            from: entityId,
            to: targetEntityId,
            damages: damages,
            description
        })
        
        //Remove health from target entity, and send die message if dead
        const targetActor = this.ecs.get(targetEntityId, "actor")

        targetActor.health -= damages

        if (targetActor.health <= 0) {

            const descriptionDie = `Entity ${targetEntityId} died !`

            this.pushMessage({
                type: "die",
                entityId: targetEntityId,
                killedBy: entityId,
                damages: damages,
                description: descriptionDie
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

        const description = `Entity ${entityId} did ${damages} ranged damages to ${targetEntityId}`

        //Push ranged attack message
        this.pushMessage({
            type: "attackRanged",
            from: entityId,
            to: targetEntityId,
            damages: damages,
            description
        })

        //Remove health from target entity, and send die message if dead
        const targetActor = this.ecs.get(targetEntityId, "actor")

        targetActor.health -= damages

        if (targetActor.health <= 0) {

            const descriptionDie = `Entity ${targetEntityId} died !`

            this.pushMessage({
                type: "die",
                entityId: targetEntityId,
                killedBy: entityId,
                damages: damages,
                description: descriptionDie
            })            

        }        
    }

}