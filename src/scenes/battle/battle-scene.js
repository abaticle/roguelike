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
        this.systems = systems        
    }

    create() {

        this.createSceneEntity()
        this.createPlayer()
        this.createComputer()

        this.systems.drawBattle.update()

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
        const players = this.ecs.searchEntities("player")

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

    createSceneEntity() {

        let scene = this.ecs.createFromAssemblage({
            alias: "Battle",
            components: ["battle", "map"],
            data: {
                battle: {
                    scene: this,
                    ui: new BattleSceneUI(this, this.ecs)
                },
                map: {
                    width: 100,
                    height: 50,
                    layout: []
                }
            }
        })

        const map = this.ecs.get("Battle", "map")

        //Update map layout
        for (let i = 0; i < map.height; i++) {
            let row = []
            
            for (let j = 0; j < map.width; j++) {
                row.push(10)
            }
            
            map.layout.push(row)
        }
    }

    createActorEntity(team, squad, desc, x, y) {
        let entity = this.ecs.createEntity([
            "position",
            "actor",
            "display"
        ])

        let {
            position,
            actor,
            display
        } = this.ecs.get(entity)

        position.x = x
        position.y = y

        actor.desc = desc
        actor.teamId = team
        actor.squadId = squad


        switch (desc) {
            case "Soldier":
                display.frame = 1
                break

            case "Archer":
                display.frame = 2
                break

            case "Gobelin":
                display.frame = 12
                break

        }

    }


    createPlayer() {
        
        //Create player 
        let player = this.ecs.createFromAssemblage({
            components: ["player"],
            data: {
                player: {
                    desc: "Player"
                }
            }
        })

        //Create squad
        let squad = this.ecs.createFromAssemblage({
            components: ["squad"],
            data: {
                squad: {
                    desc: "My soldier squad !",
                    number: 1,
                    teamId: player,
                    ai: "melee"
                }
            }
        })

        //Add soldier to squad
        Util.getRectanglePositions(2, 3, 3, 6).forEach(pos => {
            this.createActorEntity(player, squad, "Soldier", pos.x, pos.y)
        })

        let squad2 = this.ecs.createFromAssemblage({
            components: ["squad"],
            data: {
                squad: {
                    desc: "My soldier squad !",
                    number: 2,
                    teamId: player,
                    ai: "melee"
                }
            }
        }) 
        
        Util.getRectanglePositions(1, 13, 2, 16).forEach(pos => {
            this.createActorEntity(player, squad2, "Soldier", pos.x, pos.y)
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
