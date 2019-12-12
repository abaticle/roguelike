import Phaser from "phaser"
import ECSHelper from "../../lib/ecs-helper"
import MovementSystem from "../../systems/movement-system"
import AnimationSystem from "../../systems/animation-system"
import TeamCounterSystem from "../../systems/team-counter-system"
import {
    AllComponent
} from "../../components/components"
import PreparePathfindingSystem from "../../systems/prepare-pathfinding"
import UISystem from "../../systems/ui-system"
import BattleSceneUI from "./battle-scene-ui"
import Util from "../../other/utils"
import DrawBattleSystem from "../../systems/draw-battle-system"

export default class BattleScene extends Phaser.Scene {

    constructor() {
        super({
            key: "BattleScene"
        })

        this.ecs = new ECSHelper()

        this.systems = {
            preparePathfinding: new PreparePathfindingSystem(this.ecs),
            movement: new MovementSystem(this.ecs),
            animation: new AnimationSystem(this.ecs, this),
            teamCounter: new TeamCounterSystem(this.ecs),
            ui: new UISystem(this.ecs),
            drawBattle: new DrawBattleSystem(this.ecs)
        }

        window.ecs = this.ecs
    }


    preload() {
        this.load.image("arrow1", "assets/arrpw.png")
        this.load.image("ground1", "assets/dg_grounds32.gif")
        this.load.spritesheet("monsters1", "assets/dg_monster132.png", {
            frameWidth: 32,
            frameHeight: 32
        })
    }

    create() {

        this.registerComponents()

        this.createSceneEntity()
        this.createPlayer()
        this.createComputer()

        this.systems.drawBattle.update()

        this.input.on('pointerdown', (pointer) => {    
            const entityId = this.ecs.getEntityAtMousePosition(pointer, true)
            const ui = this.ecs.get("Battle", "battle", "ui")

            ui.setEntityId(entityId)

            this.systems.ui.update()

        })

        this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, (event) => {
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
        });
    }

    registerComponents() {

        AllComponent.map((component) => {
            this.ecs.registerComponent(component)
        })

    }

    turn() {

        let actions = this.ecs.get("Battle", "battle", "actions")

        if (actions.length === 0) {
            this.systems.preparePathfinding.update()
            this.systems.movement.update()
            this.systems.animation.update()
            this.systems.teamCounter.update()
            this.systems.ui.update()
        }

        this.checkEnd()

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
            "ai",
            "position",
            "actor",
            "display"
        ])

        let {
            ai,
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
                ai.mode = "melee"
                break

            case "Archer":
                display.frame = 2
                ai.mode = "ranged"
                break

            case "Gobelin":
                display.frame = 12
                ai.mode = "melee"
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
                    teamId: player
                }
            }
        })

        //Add soldier to squad
        Util.getRectanglePositions(2, 3, 2, 4).forEach(pos => {
            this.createActorEntity(player, squad, "Soldier", pos.x, pos.y)
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
                    teamId: player
                }
            }
        })

        //Add soldier to squad
        Util.getRectanglePositions(10, 3, 10, 3).forEach(pos => {
            this.createActorEntity(player, squad, "Gobelin", pos.x, pos.y)
        })
    }


    update(time) {

    }
}
