import ECS from "./../../lib/ecs-helper"
import PrepareBattleSceneUI from "./../../scenes/prepare-battle/prepare-battle-ui"
import Utils from "./../../other/utils"
import PrepareBattleUI from "./../../scenes/prepare-battle/prepare-battle-ui";

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
     * Draw a line
     * @param {position} from 
     * @param {position} to 
     */
    drawLine(from, to) {

        //Remove old selection
        this.selectionSquares.forEach(selection => {
            selection.destroy()
        })

        const positions = Utils.getLinePositions(from, to)
        
        positions.forEach(position => {

            const posX = ((position.x + 1) * 32) - 16
            const posY = ((position.y + 1) * 32) - 16

            const selection = this.add.rectangle(posX, posY, 32, 32).setStrokeStyle(2, 0xffff00)    

            this.selectionSquares.push(selection)            
        })
    }
  
    update() {
        if (this.input.activePointer.isDown) {

            if (this.from === undefined) {
                let camera = this.cameras.main

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

        this.ecs.searchEntities("squad").forEach(entityId => {

            const squad = this.ecs.get(entityId, "squad")

            if (squad.teamId === playerId) {
                squads.push({
                    desc: squad.desc, 
                    number: squad.number
                })
            }
        })

        //Update UI 
        this.ui.updateSquads(squads)
    }
}