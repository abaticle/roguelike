//Scenes 
import BattleScene from "./scenes/battle/battle-scene"
import EndBattleScene from "./scenes/end-battle/end-battle-scene"
import PrepareBattleScene from "./scenes/prepare-battle/prepare-battle"
import PreloadScene from "./scenes/preload/preload-scene"

//ECS Engine
import ECS from "./lib/ecs-helper"

//Components 
import Components from "./components/components"

//Systems 
import Animation from "./systems/animation-system"
import Draw from "./systems/draw-system"
import Input from "./systems/input-system"
import Turn from "./systems/turn-system"
import PreparePathfinding from "./systems/prepare-pathfinding"
import TeamCounter from "./systems/team-counter-system"


export default class Game extends Phaser.Game {
    constructor() {

        super({
            title: "Tests !",
            width: window.innerWidth,
            height: window.innerHeight,
            parent: "game",
            pixelArt: true,
            zoom: 2
        })

        //Create ECS
        const ecs = new ECS()

        //Init components
        ecs.registerComponent(Components)
        
        //Init systems
        const systems = {
            animation: new Animation(ecs),
            draw: new Draw(ecs),
            input: new Input(ecs),
            turn: new Turn(ecs),
            preparePathfinding: new PreparePathfinding(ecs),
            teamCounter: new TeamCounter(ecs)
        }

        //Create game component
        let game = ecs.createEntity("game")

        ecs.createAlias("Game", game)
        
        //Add scenes
        this.scene.add("Preload", new PreloadScene(ecs, systems))
        this.scene.add("PrepareBattle", new PrepareBattleScene(ecs, systems))
        this.scene.add("Battle", new BattleScene(ecs, systems))
        this.scene.add("EndBattle", new EndBattleScene(ecs, systems))
        

        //And start
        this.scene.start("Preload")




        window["ecs"] = ecs
        ecs.set(true, "Game", "game", "debug")
    }

}