import ECS from "./../../lib/ecs-helper"
import Utils from "./../../other/utils"
import PrepareBattleUI from "./../../scenes/prepare-battle/prepare-battle-ui";
import Config from "./../../config"
import SceneBase from "../scene-base"


export default class PrepareBattle extends SceneBase {

    /**
     * 
     * @param {ECS} ecs 
     * @param {object} systems 
     */
    constructor(ecs, systems) {
        super({
            key: "PrepareBattle",
            ecs,
            systems
        })
        
        this.ui = PrepareBattleUI        
        this.errorSelection = undefined
        this.isFormationValid = false
        this.from = undefined
        this.to = undefined

    }

    create() {
        this.createSceneEntity()
        this.createUI()
    }


    createSceneEntity() {
        this.ecs.createFromAssemblage({
            components: ["prepareBattle"],
            alias: "PrepareBattle"
        })
    }

    /**
     * Create DOM
     */
    createUI() {

        this.ui.setScene(this)
        this.ui.setECS(this.ecs)

        m.mount(document.getElementById("ui"), this.ui)

    }

    update() {
        this.systems.draw.update()
        this.systems.input.update()
    }


    /**
     * Remove all entities sprites from a squad
     * @param {number} squadId 
     */
    removeSquad(squadId) {
        
        this.ecs.getSquadUnits(squadId)
            .forEach(entityId => {
                const display = this.ecs.get(entityId, "display")

                if (display.sprite !== undefined) {
                    display.sprite.destroy()
                }
            })
    }

    /**
     * Remove error selection square
     */
    removeErrorSelection() {
        if (this.errorSelection !== undefined) {
            this.errorSelection.destroy()
        }
    }
    

    /**
     * Draw all entities from a squad. Use position component to draw
     * @param {number} squadId 
     */
    drawSquad(squadId) {
        
        this.ecs.getSquadUnits(squadId)
            .forEach(entityId => {     
                this.ecs.drawEntity(this, entityId)      
            })
    }

    /**
     * Draw a squad formation
     * @param {position} from From world position
     * @param {position} to To world position
     * @param {number} squadId Squad Id
     */
    drawFormation(from, to, squadId) {

        this.removeSquad(squadId)
        this.removeErrorSelection()
        


        const units = this.ecs.getSquadUnits(squadId)
        const positions = this.ecs.getFormationPositions(from, to, units.length)

        //Check if formation fit
        this.isFormationValid = units.length === positions.length

        if (this.isFormationValid) {

            //Update units positions
            units.forEach((entityId, index) => {
                const position = this.ecs.get(entityId, "position")

                position.x = positions[index].x
                position.y = positions[index].y
            })

            this.drawSquad(squadId)
        }

        else {
            
            this.ecs.set(false, squadId, "squad", "placed")

            this.errorSelection = this.ecs.drawSquare(this, Utils.convertToPixelPosition(positions[0]), Config.COLOR_SELECTION_ERROR)
        } 
    }


    update() {


        this.systems.draw.update()
        this.systems.input.update()

        

        const pointer = this.input.activePointer
        const squadId = this.ui.getPlacingSquadId()

        if (squadId !== undefined) {

            if (pointer.downElement.nodeName === "CANVAS") {

                if (pointer.isDown) {

                    if (this.from === undefined) {
                        this.from = this.ecs.convertWorldPos(pointer.position)
                    }
    
                    this.to = this.ecs.convertWorldPos(pointer.position)
    
                    this.drawFormation(this.from, this.to, squadId)
    
                } else {
                    if (this.from && this.to) {
                        this.from = undefined
                        this.to = undefined
                    }
    
                    this.ui.setCanConfirm(this.isFormationValid)
                }
            }

        }
    }

    createPlayer() {

    }

}