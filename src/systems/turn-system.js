import ECSHelper from "../lib/ecs-helper"
import MessageHelper from "../lib/message-helper"

class TurnSystem {

    /**
     * 
     * @param {ECSHelper} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
        this.messageHelper = new MessageHelper(ecs)
    }

    moveMelee(entityId) {
        
        let enemyId = this.ecs.getProximityEnemyUnit(entityId)

        //Attack ?
        if (enemyId !== undefined) {                  
            this.messageHelper.createAttackMelee(entityId, enemyId)
        }

        //Else move toward enemy
        else {            
            enemyId = this.ecs.getClosestEnemyUnit(entityId)

            if (enemyId) {
                const targetPosition = this.ecs.getNextPositionTowardEntity(entityId, enemyId)

                if (targetPosition) {                
                    this.messageHelper.createMoveMessage(entityId, targetPosition)                
                }
            }
        }
    }

    moveRanged(entityId) {
        
        let enemyId = this.ecs.getClosestEnemyUnit(entityId)

        let distance = this.ecs.getDistanceBetweenEntities(entityId, enemyId)

        let targetPosition

        //Flee ?
        if (distance < 4) {
            targetPosition = this.ecs.getOpositePositionTowardEntity(entityId, enemyId)

            if (targetPosition) {
                this.messageHelper.createMoveMessage(entityId, targetPosition)  
            }
        }

        //Move toward entity
        else if (distance > 10) {
            targetPosition = this.ecs.getNextPositionTowardEntity(entityId, enemyId)

            if (targetPosition) {                
                this.messageHelper.createMoveMessage(entityId, targetPosition)                
            }            
        }

        //Shoot
        else {
            this.messageHelper.createAttackRanged(entityId, enemyId)
        }


    }

    update() {

        this.ecs.actors
            .map(id => this.ecs.get(id, "actor"))   
            .filter(actor => actor.health > 0 && actor.inBattle)
            .forEach(actor => {

                const squad = this.ecs.get(actor.squadId, "squad")

                switch(squad.ai) {
                    case "melee":
                        this.moveMelee(actor._id)
                        break

                    case "ranged":
                        this.moveRanged(actor._id)    
                        break
                }
            })
    }
}

export default TurnSystem