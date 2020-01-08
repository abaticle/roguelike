import Phaser from "phaser"
import BattleSceneUI from "./battle-scene-ui"
import Util from "../../other/utils"
import ECS from "../../lib/ecs-helper"

export default class BattleScene extends Phaser.Scene {

    /**
     * 
     * @param {ECS} ecs 
     * @param {*} systems 
     */
    constructor(ecs, systems) {
        super({
            key: "Battle"
        })

        this.ecs = ecs
        this.ui = BattleSceneUI
        this.systems = systems        
    }

    create() {

        this.input.on('pointerdown', this.onPointerdown.bind(this))
        this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this.onKeyboardDown.bind(this));
    }


    onPointerdown(pointer) {
        const entityId = this.ecs.getEntityAtMousePosition(pointer, true)
        const ui = this.ecs.get("Battle", "battle", "ui")

        ui.setEntityId(entityId)

    }

    onKeyboardDown(event) {
        switch (event.code) {
            case "Numpad1":
                break
            case "Numpad2":
                break
            case "Numpad3":
                break
            case "Numpad4":
                break
            case "Numpad5":
                break
            case "Numpad6":
                break
            case "Numpad7":
                break
            case "Numpad8":
                break
            case "Numpad9":
                break
        }
    }

    checkEnd() {
        const players = this.ecs.searchEntities("team")

        players.forEach(playerId => {
            const player = this.ecs.get(playerId, "player")

            if (player.count === 0) {
                switch(player.desc) {
                    case "player":
                        this.scene.start("EndBattleScene", {
                            won: false
                        })
                        break;

                    case "computer":
                        this.scene.start("EndBattleScene", {
                            won: true
                        })
                        break
                } 
            }
        })
    }

    drawMap() {

        const map = this.ecs.get("Map", "map")

        this.ecs.drawMap(this, map)
    }

    drawActors() {

        this.ecs.searchEntities(["display", "position", "actor"]).map(entityId => {

            this.ecs.drawEntity(this, entityId)
        })        
    }


    createComputer() {
        //Create player 
        let player = this.ecs.createFromAssemblage({
            components: ["player"],
            data: {
                player: {
                    desc: "Computer"
                }
            }
        })

        //Create squad
        let squad = this.ecs.createFromAssemblage({
            components: ["squad"],
            data: {
                squad: {
                    desc: "Computer gobelin squad !",
                    number: 1,
                    teamId: player,
                    ai: "melee"
                }
            }
        })

        //Add soldier to squad
        Util.getRectanglePositions(10, 3, 11, 8).forEach(pos => {
            this.createActorEntity(player, squad, "Gobelin", pos.x, pos.y)
        })
    }


    update() {

        const {
            battle 
        } = this.ecs.get("Battle")

        if (battle.newTurn) {

            battle.newTurn = false

            if (battle.actions.length === 0) {

                this.systems.preparePathfinding.update()
                this.systems.movement.update()
                this.systems.animation.update()
                this.systems.teamCounter.update()
                this.systems.ui.update()
                this.checkEnd()
             
            }
        }       
    }
}
