import ECS from "./../lib/ecs"

const TILE_SIZE = 32
const TILE_MIDLE_SIZE = 16
const MOVE_DURATION = 50
const RANGED_ATTACK_DURATION = 100
const MELEE_ATTACK_DURATION = 100

class AnimationSystem {

    /**
     * Class constructor
     * @param {ECS} ecs 
     */
    constructor(ecs, scene) {
        this.ecs = ecs
        this.scene = scene

        this.working = false
    }


    /**
     * Remove first message
     */
    shiftMessage() {
        const actions = this.ecs.get("Game", "game", "actions")

        actions.shift()
    }

    /**
     * Get game speed
     * @returns {number} Current game speed
     */
    getSpeed(speed) {
        return ecs.get("Game", "game", "speed")
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


        this.scene.tweens.add({
            targets: display.sprite,
            x: (TILE_SIZE * position.x) + TILE_MIDLE_SIZE,
            y: (TILE_SIZE * position.y) + TILE_MIDLE_SIZE,
            ease: 'Power1',
            duration: MOVE_DURATION,
            onStart: () => {},
            onComplete: () => {}
        });


    }

    /**
     * Animate melee movements
     * @param {{type: string, from: number, to: number, damages: number}} message Attack melee message
     */
    animateMelee(message) {
        
    }


    /**
     *  Animate ranged attack
     * @param {{type: string, from: number, to: number, damages: number}} message Animation message
     */
    animateRanged(message) {

        console.log("ranged")

        const fromPosition = this.ecs.get(message.from, "position")
        const toPosition = this.ecs.get(message.to, "position")

        const sprite = this.scene.make.sprite({
            x: (fromPosition.x * 32) + 16,
            y: (fromPosition.y * 32) + 16,
            key: "arrow1"
        })


        this.scene.tweens.add({
            targets: sprite,
            x: (32 * toPosition.x) + 16,
            y: (32 * toPosition.y) + 16,
            ease: 'Power1',
            duration: RANGED_ATTACK_DURATION,
            onStart: () => {},
            onComplete: () => {
                sprite.destroy()
            }
        });



    }

    /**
     * @param {action.entityId} action Dieing entity
     * @param {{type: string, entityId: number, killedBy: number, damages: number}} message Die message
     */    
    animateDie(message) {

        const {
            display 
        } = this.ecs.get(message.entityId)        

        display.sprite.destroy()

    }



    step() {

        const actions = this.ecs.get("Game", "game", "actions")
        let action = actions.shift()

        this.animateAction(action)  

        this.ecs.get("Game", "game", "ui").updateMessage(action)
    }


    animateAction(action) {
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

        let actions = this.ecs.get("Game", "game", "actions")

        while(actions.length > 0) {
            
            let action = actions.shift()

            actions.forEach(action => {
                this.animateAction(action)
            })
        }        
    }
}

export default AnimationSystem