import Phaser from "phaser"
import ECS from "../lib/ecs"
import MovementSystem from "../systems/movement-system"
import AnimationSystem from "../systems/animation-system"
import { AllComponent } from "./../components/components"
import PreparePathfindingSystem from "../systems/prepare-pathfinding"
import GameSceneUI from "./../ui/game-scene-ui"

class GameScene extends Phaser.Scene {

    constructor() {
        super({
            key: "GameScene"
        })
        
        this.ecs = new ECS()
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

        this.createGameEntity()
        this.createMapEntity()
        this.createActorEntities()
        this.createSystems()

        this.drawMap()
        this.drawActors()

    }
    
    registerComponents() {

        AllComponent.map((component)=> {
            this.ecs.registerComponent(component)
        })

    }

    createSystems() {
        this.systems = {
            preparePathfinding: new PreparePathfindingSystem(this.ecs),
            movement: new MovementSystem(this.ecs),
            animation: new AnimationSystem(this.ecs, this)
        }
    }
    
    turn() {

        let actions = this.ecs.get("Game", "game", "actions")

        if (actions.length === 0) {
            this.systems.preparePathfinding.update()
            this.systems.movement.update()

            this.systems.animation.update()
        }

        //this.systems.animation.step()
        
    }

    drawMap() {
        let map = this.ecs.get("Map", "map")

        map.tilemap = this.make.tilemap({ data: map.layout, tileWidth: 32, tileHeight: 32 });

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
        })
    }

    createGameEntity() {
        let gameEntity = this.ecs.createEntity("game")
        
        this.ecs.createAlias("Game", gameEntity)

        this.ecs.set(new GameSceneUI(this), "Game", "game", "ui")
    }

    createMapEntity() {
        let mapEntity = this.ecs.createEntity("map")
        this.ecs.createAlias("Map", mapEntity)

        const map = {
            width: 20,
            height: 10,
            layout: []
        }

        for (let i = 0; i < map.height; i++) {
            let row = []
            for (let j = 0; j < map.width; j++) {
                row.push(10)
            }
            map.layout.push(row)
        }        
        
        this.ecs.set(map, "Map", "map")      
    }

    createActorEntity(team, desc, x, y) {
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
        actor.team = team


        switch(desc) {
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

    createActorEntities() {

        //this.createActorEntity(0, "Soldier", 3, 1)
        //this.createActorEntity(0, "Soldier", 3, 2)
        //this.createActorEntity(0, "Soldier", 3, 3)        
        this.createActorEntity(0, "Archer", 1, 1)
        this.createActorEntity(0, "Archer", 1, 2)
        this.createActorEntity(0, "Archer", 1, 3)

        this.createActorEntity(1, "Gobelin", 9, 1)
        this.createActorEntity(1, "Gobelin", 9, 2)
        this.createActorEntity(1, "Gobelin", 9, 3)
        this.createActorEntity(1, "Gobelin", 8, 1)
        this.createActorEntity(1, "Gobelin", 8, 2)
        this.createActorEntity(1, "Gobelin", 8, 3)
    }

    update(time) {

    }
}

export default GameScene
