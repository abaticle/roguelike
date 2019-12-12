import Phaser from "phaser"
import ECS from "../../lib/ecs"
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
import DrawSystem from "../../systems/draw-system"

export default class BattleScene extends Phaser.Scene {

    constructor() {
        super({
            key: "BattleScene"
        })

        this.ecs = new ECS()
        this.ecsHelper = new ECSHelper(this.ecs)
        this.systems = {}
        this.working = false

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

        //this.createGameEntity()
        //this.createMapEntity()

        this.createSceneEntity()
        this.createPlayer()
        this.createComputer()
        this.createSystems()

        this.drawMap()
        this.drawActors()


        this.input.on('pointerdown', (pointer) => {            

            const entityId = this.ecsHelper.getEntityAtMousePosition(pointer, true)

            const ui = this.ecs.get("BattleScene", "battleScene", "ui")

            ui.setEntityId(entityId)

            this.systems.uiSystem.update()

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

    createSystems() {

        this.systems = {
            preparePathfinding: new PreparePathfindingSystem(this.ecs),
            movement: new MovementSystem(this.ecs),
            animation: new AnimationSystem(this.ecs, this),
            teamCounter: new TeamCounterSystem(this.ecs),
            uiSystem: new UISystem(this.ecs),
            drawSystem: new DrawSystem(this.ecs)
        }

    }

    turn() {

        let actions = this.ecs.get("BattleScene", "battleScene", "actions")

        if (actions.length === 0) {
            this.systems.preparePathfinding.update()
            this.systems.movement.update()
            this.systems.animation.update()
            this.systems.teamCounter.update()
            this.systems.uiSystem.update()
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

    drawMap() {
        const map = this.ecs.get("BattleScene", "map")

        map.tilemap = this.make.tilemap({
            data: map.layout,
            tileWidth: 32,
            tileHeight: 32
        });

        const tiles = map.tilemap.addTilesetImage("ground1");
        const groundLayer = map.tilemap.createStaticLayer(0, tiles, 0, 0);
    }

    drawActors() {
        this.ecs.searchEntities(["display", "position", "actor"]).map(entityId => {

            const {
                display,
                position
            } = this.ecs.get(entityId)            


            display.sprite = this.make.sprite({
                key: "monsters1",
                frame: display.frame,
                x: (32 * position.x) + 16,
                y: (32 * position.y) + 16
            })

//display.sprite = this.add.sprite((32 * position.x) + 16, (32 * position.y) + 16, "monsers1", display.frame)
            
            display.container = this.add.container((32 * position.x) + 16, (32 * position.y) + 16, display.sprite)

        })
    }


    createSceneEntity() {

        let scene = this.ecs.createFromAssemblage({
            alias: "BattleScene",
            components: ["battleScene", "map"],
            data: {
                battleScene: {
                    ui: new BattleSceneUI(this, this.ecs)
                },
                map: {
                    width: 100,
                    height: 50,
                    layout: []
                }
            }
        })

        const map = this.ecs.get("BattleScene", "map")

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
        Util.getRectanglePositions(2, 3, 3, 6).forEach(pos => {
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
        Util.getRectanglePositions(10, 3, 11, 6).forEach(pos => {
            this.createActorEntity(player, squad, "Gobelin", pos.x, pos.y)
        })
    }


    update(time) {

    }
}
