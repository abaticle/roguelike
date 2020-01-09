import { PrepareBattleComponent } from "../components/components"

export default class InputSystem {
    
    constructor(ecs) {
        this.ecs = ecs 
    }

    get pointer() {
        return this.ecs.scene.input.activePointer
    }

    update() {
        const scene = this.ecs.scene

        /** @type {PrepareBattleComponent} */
        const prepareBattle = this.ecs.get("PrepareBattle", "prepareBattle")

        if (prepareBattle.placingSquadId !== undefined) {

            const pointer = this.pointer

            if (pointer.downElement.nodeName === "CANVAS") {

                if (pointer.isDown) {

                    if (prepareBattle.from === undefined) {
                        prepareBattle.from = this.ecs.convertWorldPos(pointer.position)
                    }
    
                    prepareBattle.to = this.ecs.convertWorldPos(pointer.position)
    
                    //this.drawFormation(this.from, this.to, squadId)
    
                } else {
                    if (this.from && this.to) {
                        prepareBattle.from = undefined
                        prepareBattle.to = undefined
                    }
    
                    //this.ui.setCanConfirm(this.isFormationValid)
                }
            }

        }
    }
}