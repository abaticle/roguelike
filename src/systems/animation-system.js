import ECSHelper from "../lib/ecs-helper"
import Utils from "../other/utils"
import config from "../config"
<<<<<<< HEAD
=======

>>>>>>> 805d7ae0582e2dd6ac4da42108f49bcc4783a1f5

export default class AnimationSystem {

    /**
     * 
     * @param {ECSHelper} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }


    animateAttackMelee(dt, message) {
        this.removeMessage(message)
    }


    animateAttackRanged(dt, message) {
        this.removeMessage(message)
    }

    /**
     * 
     * @param {number} dt 
     * @param {DieMessage} message 
     */
    animateDie(dt, message) {

        let {
            entityId 
        } = message

        let {
            display
        } = this.ecs.get(entityId)

        display.draw = false
        
        if (display.container) {
            display.container.visible = false            
        }

        this.removeMessage(message)

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

        let nextPixelPosition = this.ecs.convertMapPos(nextPosition)

        if (display.container.x === nextPixelPosition.x && display.container.y === nextPixelPosition.y) {
<<<<<<< HEAD
=======

            //Update entity map position and remove move message
            position.x = nextPosition.x
            position.y = nextPosition.y        
            
>>>>>>> 805d7ae0582e2dd6ac4da42108f49bcc4783a1f5
            this.removeMessage(message)
        }
<<<<<<< HEAD
        else {                       
            let newPosition = Utils.moveToward(display.container, nextPixelPosition, config.MOVE_DURATION)
=======

        else {           
            let speed = Math.round(dt / config.MOVE_SPEED)
            
            if (speed = 0) {
                speed = 1
            }

            if (nextPixelPosition.x > display.container.x) {
                display.container.x += speed
            }
            if (nextPixelPosition.x < display.container.x) {
                display.container.x -= speed
            }

            if (nextPixelPosition.y > display.container.y) {
                display.container.y += speed
            }
            if (nextPixelPosition.y < display.container.y) {
                display.container.y -= speed
            }

            if (Utils.distance(display.container.x, display.container.y, nextPixelPosition.x, nextPixelPosition.y) < speed) {
                display.container.x = nextPixelPosition.x
                display.container.y = nextPixelPosition.y
            }
            

            /*
            let newPosition = Utils.moveToward(display.container, nextPixelPosition, 1)
>>>>>>> 805d7ae0582e2dd6ac4da42108f49bcc4783a1f5

            display.container.x = newPosition.x
            display.container.y = newPosition.y
            */
        }
    }

    /**
     * 
     * @param {Message} message 
     */
    removeMessage(message) {
        const battle = this.ecs.get("Battle", "battle")

        battle.actions = battle.actions.filter(action => action !== message)
    }

    /**
     * 
     * @param {number} dt 
     */
    update(dt) {

        /** @type {BattleComponent} */
        const battle = this.ecs.get("Battle", "battle")

        if (battle.newTurn) {           

            this.ecs.actions.forEach(action => {

                switch(action.type) {
                    case "die":
                        this.animateDie(dt, action)
                        break

                    case "attackMelee":
                        this.animateAttackMelee(dt, action)
                        break

                    case "move":
                        this.animateMove(dt, action)
                        break

                    case "attackRanged":
                        this.animateAttackRanged(dt, action)
                        break
                }

            })
        }
    }
}