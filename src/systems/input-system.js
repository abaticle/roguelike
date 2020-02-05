import { PrepareBattleComponent, ActorComponent } from "../components/components"
import ECS from "../lib/ecs-helper"
import Utils from "../other/utils"

export default class InputSystem {
    
    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs 
    }

    get pointer() {
        return this.ecs.scene.input.activePointer
    }



    isInUI({x, y}) {
        let ui = this.ecs.get("PrepareBattle", "prepareBattle", "squadConfirmUI")

        if (x > ui.x && x < (ui.x + ui.width)) {
            if (y > ui.y && y < (ui.y + ui.height)) {
                return true
            }
        }
        return false
    }


    /**
     * 
     * @param {PrepareBattleComponent} prepareBattle 
     */
    setFormation(prepareBattle) {
        

        const units = this.ecs.getSquadUnits(prepareBattle.placingSquadId)
        const positions = this.ecs.getFormationPositions(prepareBattle.from, prepareBattle.to, units.length)

        let drawError = false

        units
            .map(id => this.ecs.get(id))
            .forEach(({position, display, actor}, index) => {

                if (positions.length === units.length) {
                    

                    position.x = positions[index].x
                    position.y = positions[index].y                    
                    display.draw = true
                    //actor.inBattle = true
                }
                else {
                    
                    position.x = 0
                    position.y = 0
                    display.draw = false
                    //actor.inBattle = false

                    drawError = true
                }
            })

        //prepareBattle.drawError = drawError
        prepareBattle.canConfirm = !drawError

    }


    /**
     * @returns {PrepareBattleComponent}
     */
    getPrepareBattle() {
        return this.ecs.get("PrepareBattle", "prepareBattle")
    }


    updatePrepareBattle() {

        const prepareBattle = this.getPrepareBattle()

        if (prepareBattle.placingSquadId !== undefined) {

            const pointer = this.pointer

            //if (pointer.downElement.nodeName === "CANVAS") {
            if (!this.isInUI(pointer)) {

                if (pointer.isDown) {

                    if (prepareBattle.from === undefined) {
                        prepareBattle.from = this.ecs.convertWorldPos(pointer.position)
                    }
                    prepareBattle.to = this.ecs.convertWorldPos(pointer.position)
                    
                    this.setFormation(prepareBattle)
    
                } else {
                    if (prepareBattle.from && prepareBattle.to) {
                        prepareBattle.from = undefined
                        prepareBattle.to = undefined
                    }
                }
            }

        }
    }

    updateBattle() {

    }

    update() {

        switch(this.ecs.sceneKey) {
            case "Battle":
                this.updateBattle()
                break

            case "PrepareBattle":
                this.updatePrepareBattle()
                break
        }

    }
}