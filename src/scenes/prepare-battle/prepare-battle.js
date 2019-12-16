import ECS from "./../../lib/ecs-helper"
import PrepareBattleSceneUI from "./../../scenes/prepare-battle/prepare-battle-ui"
import Utils from "./../../other/utils"
import PrepareBattleUI from "./../../scenes/prepare-battle/prepare-battle-ui";
import Config from "./../../config"
import { Util } from "pathfinding";

export default class PrepareBattle extends Phaser.Scene{
    
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
        this.ui = new PrepareBattleUI(ecs, this)

        m.mount(document.getElementById("ui"), this.ui)
        
        this.selectionSquares = []
        this.selectionUnits = []

        this.from = undefined
        this.to = undefined
    }

    create() {
        this.createSceneEntity()
        this.updateUI()
    }


    /**
     * 
     * @param {position} position 
     */
    drawSquare(position) {
        return this.add.rectangle(position.x, position.y, Config.TILE_SIZE, Config.TILE_SIZE).setStrokeStyle(2, 0xffff00)   
    }

    /**
     * Draw a line
     * @param {position} from 
     * @param {position} to 
     */
    drawLine(from, to) {

        //Remove old selection
        this.selectionSquares.forEach(selection => {
            selection.destroy()
        })

        //Create array of positions to draw, and convert to world pos
        let positions = Utils.getLinePositions(from, to)
        

        //Add a line behind
        if (positions.length > 1) {
                        
            const fromTemp = Utils.rotate(positions[0], positions[1], 270)
            const toTemp = Utils.rotate(positions[positions.length - 1], positions[positions.length - 2], 90)

            Utils.getLinePositions(fromTemp, toTemp).forEach(position => {
                positions.push(position)
            })            
        }


        positions = positions.map(position => {
            position.x = ((position.x + 1) * 32) - 16
            position.y = ((position.y + 1) * 32) - 16

            return position
        })
        
        //Draw each squares 
        positions.forEach((position, index) => {
  
            const selection = this.drawSquare(position)
            
            //Fill an array of squares :
            this.selectionSquares.push(selection)
        })
    }

    getSquadUnits(squadId) {
        
    }
  
    update() {

        const squadId = placingSquadId

        if (this.ui.placingSquadId !== undefined) {

            if (this.input.activePointer.isDown) {

                if (this.from === undefined) {
                    this.from = this.ecs.getWorldPositionFromMousePosition(this.input.activePointer.position)                
                }
                
                this.to = this.ecs.getWorldPositionFromMousePosition(this.input.activePointer.position)   
    
                this.drawLine(this.from, this.to)
            } else {
                if (this.from && this.to) {
                    this.drawLine(this.from, this.to)
    
                    this.from = undefined
                    this.to = undefined
                }
            }   
        }     
    }
    
    createSceneEntity() {
        let scene = this.ecs.createFromAssemblage({
            alias: "PrepareBattle",
            components: ["battle", "map"],
            data: {
                prepareBattle: {
                    scene: this,
                    ui: new PrepareBattleSceneUI(this, this.ecs)
                },
                map: {
                    width: 120,
                    height: 50,
                    layout: []
                }
            }
        })

        const map = this.ecs.get("PrepareBattle", "map")

        //Update map layout
        for (let i = 0; i < map.height; i++) {
            let row = []
            
            for (let j = 0; j < map.width; j++) {
                //row.push(10)
                row.push(Utils.randomInteger(9, 10))
            }
            
            map.layout.push(row)
        }      
        
        //Draw map:
        this.ecs.drawMap(this, map)
    }

    createPlayer() {

    }

    updateUI() {

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
        this.ui.updateSquads(squads)
    }
}