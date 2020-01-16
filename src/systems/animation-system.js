import ECSHelper from "../lib/ecs-helper"
import Utils from "../other/utils"
import config from "../config"


export default class AnimationSystem {

    /**
     * 
     * @param {ECSHelper} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
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

            //Update entity map position and remove move message
            position.x = nextPosition.x
            position.y = nextPosition.y        
            
            this.removeMessage(message)

        }

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

            display.container.x = newPosition.x
            display.container.y = newPosition.y
            */
        }

    }


    removeMessage(message) {
        const battle = this.ecs.get("Battle", "battle")

        battle.actions = battle.actions.filter(action => action !== message)
    }

    /**
     * 
     * @param {number} dt 
     */
    update(dt) {

        this.ecs.actions.forEach(action => {

            switch(action.type) {
                case "die":
                    break

                case "attackMelee":
                    break

                case "move":
                    this.animateMove(dt, action)
                    break

                case "attackRanged":
                    break
            }

        })


        this.ecs.actors.map(id => this.ecs.get(id)).forEach(data => {

            const {
                position 
            } = data

            
        })
    }
}