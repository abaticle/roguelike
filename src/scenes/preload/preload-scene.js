import ECS from "./../../lib/ecs-helper"
import EntityFactory from "../../factories/entity-factory"
import Utils from "../../other/utils"

export default class PreloadScene extends Phaser.Scene {
    /**
     * Class constructor
     * @param {ECS} ecs 
     * @param {*} systems 
     */
    constructor(ecs, systems) {
        super({
            key: "Preload"
        })

        this.ecs = ecs
        this.systems = systems
    }


    /**
     * Preload assets
     */
    preload() {
        this.load.image("arrow1", "assets/arrpw.png")
        this.load.image("ground1", "assets/dg_grounds32.gif")
        this.load.spritesheet("monsters1", "assets/dg_monster132.png", {
            frameWidth: 32,
            frameHeight: 32
        })
    }


    /**
     * Create : 
     * - map
     * - player
     * - computer
     * And play battle
     */
    create() {
        this.createMap()
        this.createPlayer()
        this.createComputer()
        this.start()
    }

    /**
     * Create map
     */
    createMap() {
        this.ecs.createFromAssemblage({
            alias: "Map",
            components: ["map"],
            data: {
                map: {
                    width: 120,
                    height: 50,
                    layout: []
                }
            }
        })        

        const map = this.ecs.get("Map", "map")

        map.layout = Utils.getRandomMapLayout(map.width, map.height)
    }

    /**
     * Create computer
     */
    createComputer() {
        let computer = this.ecs.createFromAssemblage({
            alias: "Computer",
            components: ["player"],
            data: {
                player: {
                    desc: "Computer"
                }
            }
        })

        let squad = this.ecs.createFromAssemblage({
            components: ["squad"],
            data: {
                squad: {
                    desc: "Squad 1",
                    number: 1,
                    teamId: computer,
                    ai: "melee",
                    placed: true
                }
            }
        })     


        const entityFactory = new EntityFactory(this.ecs)
        
        Utils.getRectanglePositions(20, 5, 22, 10).forEach(pos => {            

            entityFactory.createActor(computer, squad, "Gobelin", pos.x, pos.y)
            
        });
    }

    /**
     * Create player
     */
    createPlayer() {

        //Create player 
        let player = this.ecs.createFromAssemblage({
            alias: "Player",
            components: ["player"],
            data: {
                player: {
                    desc: "Player"
                }
            }
        })

        //Create squads
        let squad = this.ecs.createFromAssemblage({
            components: ["squad"],
            data: {
                squad: {
                    desc: "Squad 1",
                    number: 1,
                    teamId: player,
                    ai: "melee",
                    placed: false
                }
            }
        })

        let squad2 = this.ecs.createFromAssemblage({
            components: ["squad"],
            data: {
                squad: {
                    desc: "Squad 2",
                    number: 2,
                    teamId: player,
                    ai: "melee"
                }
            }
        })        

        const entityFactory = new EntityFactory(this.ecs)

        entityFactory.createActor(player, squad, "Soldier")
        entityFactory.createActor(player, squad, "Soldier")
        entityFactory.createActor(player, squad, "Soldier")
        entityFactory.createActor(player, squad, "Soldier")
        entityFactory.createActor(player, squad, "Soldier")
        entityFactory.createActor(player, squad, "Soldier")
        entityFactory.createActor(player, squad, "Soldier")
        entityFactory.createActor(player, squad, "Soldier")
        entityFactory.createActor(player, squad, "Soldier")
        entityFactory.createActor(player, squad, "Soldier")
        entityFactory.createActor(player, squad2, "Archer")
        entityFactory.createActor(player, squad2, "Archer")
        entityFactory.createActor(player, squad2, "Archer")
        entityFactory.createActor(player, squad2, "Archer")
        entityFactory.createActor(player, squad2, "Archer")
        entityFactory.createActor(player, squad2, "Archer")
        entityFactory.createActor(player, squad2, "Archer")
        entityFactory.createActor(player, squad2, "Archer")
    }

    /**
     * Start and launch PrepareBattle scene
     */
    start() {
        this.scene.start("PrepareBattle")
    }
}