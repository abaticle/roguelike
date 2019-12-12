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
        if (enemyId !== undefined) {                  
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

    moveRanged(entityId) {
        
        let enemyId = this.ecsHelper.getClosestEnemyUnit(entityId)

        let distance = this.ecsHelper.getDistanceBetweenEntities(entityId, enemyId)

        let targetPosition

        //Flee ?
        if (distance < 4) {
            targetPosition = this.ecsHelper.getOpositePositionTowardEntity(entityId, enemyId)

            if (targetPosition) {
                this.messageHelper.createMoveMessage(entityId, targetPosition)  
            }
        }

        //Move toward entity
        else if (distance > 10) {
            targetPosition = this.ecsHelper.getNextPositionTowardEntity(entityId, enemyId)

            if (targetPosition) {                
                this.messageHelper.createMoveMessage(entityId, targetPosition)                
            }            
        }

        //Shoot
        else {
            this.messageHelper.createAttackRanged(entityId, enemyId)
        }


    }

    update(time) {
        let entities = this.ecs.searchEntities(["actor", "position", "ai"])

        entities.forEach(entityId => {
            const {
                actor,
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
                    this.moveRanged(entityId)    
                    break
            }
        })
    }
}

export default MovementSystem