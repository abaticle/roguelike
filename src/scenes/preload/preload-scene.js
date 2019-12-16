import ECS from "./../../lib/ecs-helper"
import EntityFactory from "../../factories/entity-factory"

export default class PreloadScene extends Phaser.Scene {
    /**
     * 
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

    preload() {
        this.load.image("arrow1", "assets/arrpw.png")
        this.load.image("ground1", "assets/dg_grounds32.gif")
        this.load.spritesheet("monsters1", "assets/dg_monster132.png", {
            frameWidth: 32,
            frameHeight: 32
        })
    }

    create() {
        this.createPlayer()
        this.createEnemy()
        this.start()
    }


    createEnemy() {
       
    }


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
                    ai: "melee"
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
        entityFactory.createActor(player, squad2, "Soldier")
        entityFactory.createActor(player, squad2, "Soldier")
        entityFactory.createActor(player, squad2, "Soldier")
        entityFactory.createActor(player, squad2, "Soldier")
    }

    start() {
        this.scene.start("PrepareBattle")
    }
}