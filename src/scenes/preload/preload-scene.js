import ECSHelper from "./../../lib/ecs-helper"
import EntityFactory from "../../factories/entity-factory"
import Utils from "../../other/utils"
import SceneBase from "../scene-base"
import config from "../../config"

/**
 * @extends {SceneBase}
 */
export default class PreloadScene extends SceneBase {
    /**
     * Class constructor
     * @param {ECSHelper} ecs 
     * @param {any} systems 
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
        this.load.image("sprites", "assets/sprites.png")
        this.load.spritesheet("sprites1", "assets/sprites.png", {
            frameWidth: config.TILE_SIZE,
            frameHeight: config.TILE_SIZE
        })
        this.load.image("arrow1", "assets/arrpw.png")
        this.load.image("ground1", "assets/dg_grounds32.gif")
        this.load.spritesheet("monsters1", "assets/dg_monster132.png", {
            frameWidth: config.TILE_SIZE,
            frameHeight: config.TILE_SIZE
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
        
        Utils.getRectanglePositions(10, 5, 13, 15).forEach(({x, y}) => {            
            
            factory.createActor({
                teamId: computer,
                squadId: squad,
                desc: "Gobelin",
                x,
                y,
                draw: true,
                inBattle: true
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
        let squad1 = this.ecs.createFromAssemblage({
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

        let squad3 = this.ecs.createFromAssemblage({
            components: ["squad"],
            data: {
                squad: {
                    desc: "Squad 3",
                    number: 3,
                    teamId: player,
                    ai: "melee"
                }
            }
        })         

        const factory = new EntityFactory(this.ecs)

        for (let i = 0; i < 100; i++) {

            let s = 0

            if (i < 30) {
                s = squad1
            }
            else {
                if (i < 60) {
                    s = squad2
                }
                else {
                    s = squad3
                }
            }
            
            let id = factory.createActor({
                teamId: player,
                squadId: s,
                x: 0,
                y: 0,
                draw: false,
                inBattle: false
            })

            /*
            if (s === squad1) {
                let {
                    position,
                    actor,
                    display
                } = this.ecs.get(id)

                position.x = 3
                position.y = 2 + i

                actor.inBattle = true

                display.draw = true

            }
            */

        }
    }

    /**
     * Start and launch PrepareBattle scene
     */
    start() {
        //this.scene.start("PrepareBattle")
        this.scene.start("World")
    }
}