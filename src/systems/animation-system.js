import ECS from "./../lib/ecs"
import Utils from "./../other/utils"
import config from "../config"


const TILE_SIZE = 32
const TILE_MIDLE_SIZE = 16
const MOVE_DURATION = 50
const RANGED_ATTACK_DURATION = 40
const MELEE_ATTACK_DURATION = 40
const DIE_DURATION = 30

class AnimationSystem {

    /**
     * Class constructor
     * @param {ECS} ecs 
     */
    constructor(ecs, scene) {
        this.ecs = ecs
        this.scene = scene
        this.timeline = undefined
    }

    /**
     * Remove first message
     */
    shiftMessage() {
        const actions = this.ecs.get("Battle", "battle", "actions")

        actions.shift()
    }

    /**
     * Animate movement
     * @param {MoveMessage} message Move message 
     */
    animateMove(message) {
        
        const {
            display,
            position
        } = this.ecs.get(message.entityId)        

        this.timeline.add({
            targets: display.container,
            x: (config.TILE_SIZE * position.x) + config.TILE_MIDLE_SIZE,
            y: (config.TILE_SIZE * position.y) + config.TILE_MIDLE_SIZE,
            ease: 'Power1',
            duration: config.MOVE_DURATION,
            onStart: () => {},
            onComplete: () => {}
        });


    }

    /**
     * Animate melee movements
     * @param {{type: string, from: number, to: number, damages: number}} message Attack melee message
     */
    animateMelee(message) {
        
        const {
            display, 
            position
        } = this.ecs.get(message.from)

        const toPosition = this.ecs.get(message.to, "position")
        const targetPosition = Utils.getPositionBetweenTwoPoints(position.x, position.y, toPosition.x, toPosition.y)

        this.timeline.add({
            targets: display.container,
            x: (config.TILE_SIZE * targetPosition.x) + config.TILE_MIDLE_SIZE,
            y: (config.TILE_SIZE * targetPosition.y) + config.TILE_MIDLE_SIZE,
            duration: config.MELEE_ATTACK_DURATION,
            yoyo: true
        })

    }


    /**
     * Animate ranged attack
     * @param {{type: string, from: number, to: number, damages: number}} message Animation message
     */
    animateRanged(message) {

        const fromPosition = this.ecs.get(message.from, "position")
        const toPosition = this.ecs.get(message.to, "position")

        const arrowSprite = this.scene.make.sprite({
            x: (fromPosition.x * 32) + 16,
            y: (fromPosition.y * 32) + 16,
            key: "arrow1"
        })

        this.timeline.add({
            targets: arrowSprite,
            x: (32 * toPosition.x) + 16,
            y: (32 * toPosition.y) + 16,
            ease: 'Power1',
            duration: config.RANGED_ATTACK_DURATION,
            onStart: () => {},
            onComplete: () => {
                arrowSprite.destroy()
            }
        });



    }

    /**
     * Animate die
     * @param {action.entityId} action Dieing entity
     * @param {{type: string, entityId: number, killedBy: number, damages: number}} message Die message
     */    
    animateDie(message) {

        const {
            display 
        } = this.ecs.get(message.entityId)        

        //display.sprite.destroy()

        this.timeline.add({
            targets: display.container,
            ease: 'Power1',
            duration: config.DIE_DURATION,
            alpha: 0,
            onStart: () => {},
            onComplete: () => {
                display.container.destroy()
            }
        });
    }

    handleAction(action) {
        switch (action.type) {
            case "move":
                this.animateMove(action)
                break

            case "attackMelee":
                this.animateMelee(action)
                break

            case "attackRanged":
                this.animateRanged(action)
                break

            case "die":
                this.animateDie(action)
                break
        }
    }

    update() {

        let actions = this.ecs.get("Battle", "battle", "actions")

        this.timeline = this.scene.tweens.createTimeline();

        while(actions.length > 0) {            
            this.handleAction(actions.shift())
        }        

        this.timeline.play()
    }
}

export default AnimationSystem