import ECS from "./../../lib/ecs-helper"
import Utils from "./../../other/utils"
import PrepareBattleUI from "./../../scenes/prepare-battle/prepare-battle-ui";
import Config from "./../../config"
import {
    Util
} from "pathfinding";


export default class PrepareBattle extends Phaser.Scene {

    /**
     * 
     * @param {ECS} ecs 
     * @param {object} systems 
     */
    constructor(ecs, systems) {
        super({
            key: "PrepareBattle"
        })

        this.ecs = ecs
        this.systems = systems
        this.ui = PrepareBattleUI
        this.errorSelection = undefined
        this.isFormationValid = false
        this.from = undefined
        this.to = undefined

        this.ui.setScene(this)
        this.ui.setECS(ecs)

        m.mount(document.getElementById("ui"), this.ui)
    }

    create() {
        this.createSceneEntity()
        this.createUI()
        this.draw()
    }


    draw() {
        this.ecs.drawMap(this, this.ecs.get("Map", "map"))
        this.ecs.drawActors(this)
    }


    /**
     * 
     * @param {position} position 
     */
    drawSquare(position, color = Config.COLOR_SELECTION) {

        return this.add
            .rectangle(position.x, position.y, Config.TILE_SIZE, Config.TILE_SIZE)
            .setStrokeStyle(2, color)

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
    

    drawEntity(entityId) {
        
        const {
            display,
            position
        } = this.ecs.get(entityId)

        let pixelPosition = Utils.convertToPixelPosition(position)

        display.x = pixelPosition.x
        display.y = pixelPosition.y

        display.sprite = this.add.sprite(0, 0, "monsters1", display.frame)
        
        display.container = this.add.container(pixelPosition.x, pixelPosition.y)
        display.container.add(display.sprite)     
    }

    /**
     * Draw all entities sprites from a squad. Use position component to draw
     * @param {number} squadId 
     */
    drawSquad(squadId) {
        
        this.ecs.getSquadUnits(squadId)
            .forEach(entityId => {     
                this.drawEntity(entityId)      
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

            this.errorSelection = this.drawSquare(Utils.convertToPixelPosition(positions[0]), Config.COLOR_SELECTION_ERROR)
        } 
    }


    update() {

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

    createSceneEntity() {
        
        this.ecs.createFromAssemblage({
            alias: "PrepareBattle",
            components: ["prepareBattle"],
            data: {
                prepareBattle: {
                    scene: this
                }
            }
        })

    }

    createPlayer() {

    }

    createUI() {

        //Get current player
        const playerId = this.ecs.getAlias("Player")


        //Fill squad array
        const squads = []

        this.ecs.searchEntities("squad").forEach(squadId => {

            const squad = this.ecs.get(squadId, "squad")

            if (squad.teamId === playerId) {

                const units = this.ecs
                    .searchEntities("actor")
                    .filter(actorId => {
                        if (this.ecs.get(actorId, "actor", "squadId") === squadId) {
                            return true
                        }
                        return false
                    })
                    .map((actorId => this.ecs.get(actorId, "actor")))

                squads.push({
                    squadId,
                    desc: squad.desc,
                    number: squad.number,
                    placing: false,
                    units
                })
            }
        })

        //Update UI 
        this.ui.setSquads(squads)
    }
}