import ECS from "./../lib/ecs"
import ECSHelper from "../lib/ecs-helper"
import MessageHelper from "../lib/message-helper"

class MovementSystem {

    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
        this.ecsHelper = new ECSHelper(ecs)
        this.messageHelper = new MessageHelper(ecs)
    }

    moveMelee(entityId) {
        
        let enemyId = this.ecsHelper.getProximityEnemyUnit(entityId)

        //Attack ?
        if (enemyId) {                  
            this.messageHelper.createAttackMelee(entityId, enemyId)
        }

        //Else move toward enemy
        else {            
            enemyId = this.ecsHelper.getClosestEnemyUnit(entityId)

            if (enemyId) {
                const targetPosition = this.ecsHelper.getNextPositionTowardEntity(entityId, enemyId)

                if (targetPosition) {                
                    this.messageHelper.createMoveMessage(entityId, targetPosition)                
                }
            }
        }
    }

    moveRanged() {

    }

    update(time) {
        let entities = this.ecs.searchEntities(["actor", "position", "ai"])

        entities.forEach(entityId => {
            const {
                actor,
                position, 
                ai
            } = this.ecs.get(entityId)

            if (actor.health <= 0) {
                return
            } 


            switch(ai.mode) {
                case "melee":
                    this.moveMelee(entityId)
                    break

                case "ranged":
                    this.moveRanged()    
                    break
            }


        });


    }
}

export default MovementSystem