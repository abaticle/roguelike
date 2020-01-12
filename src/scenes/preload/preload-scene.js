import ECS from "./../../lib/ecs-helper"
import EntityFactory from "../../factories/entity-factory"
import Utils from "../../other/utils"
import SceneBase from "../scene-base"

export default class PreloadScene extends SceneBase {
    /**
     * Class constructor
     * @param {ECS} ecs 
     * @param {*} systems 
     */
    constructor(ecs, systems) {
        super({
            key: "Preload",
            ecs,
            systems
        })
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
                    layout: Utils.getRandomMapLayout(120, 50)
                }
            }
        })        
    }

    /**
     * Create computer
     */
    createComputer() {
        let computer = this.ecs.createFromAssemblage({
            alias: "Computer",
            components: ["team"],
            data: {
                team: {
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


        const factory = new EntityFactory(this.ecs)
        
        Utils.getRectanglePositions(20, 5, 22, 5).forEach(({x, y}) => {            
            
            factory.createActor({
                teamId: computer,
                squadId: squad,
                desc: "Gobelin",
                x,
                y,
                draw: true
            })
            
        });
    }

    /**
     * Create player
     */
    createPlayer() {

        //Create player 
        let player = this.ecs.createFromAssemblage({
            alias: "Player",
            components: ["team"],
            data: {
                team: {
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

        const factory = new EntityFactory(this.ecs)

        for (let i = 0; i < 15; i++) {
            
            factory.createActor({
                teamId: player,
                squadId: i < 10 ? squad : squad2,
                x: 0,
                y: 0,
                draw: false

            })

        }
    }

    /**
     * Start and launch PrepareBattle scene
     */
    start() {
        this.scene.start("PrepareBattle")
    }
}