import ECS from "../lib/ecs-helper";


export default class EntityFactory {

    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }

    /**
     * Get frame from actor desc
     * @param {string} desc 
     * @returns {number} Frame number
     */
    getFrame(desc) {

        switch (desc) {
            case "Soldier":
                return 1

            case "Archer":
                return 2

            case "Gobelin":
                return 12

        }        
    }

    /**
     * 
     * @param {number?} teamId 
     * @param {number}? squadId 
     * @param {desc?} desc 
     * @param {number?} x 
     * @param {number?} y 
     * @param {boolean?} draw 
     */
    createActor(teamId = undefined, squadId = undefined, desc = "Soldier", x = 0, y = 0, draw = true) {

        this.ecs.createFromAssemblage({
            components: ["position", "actor", "display"],
            data: {
                position: {
                    x,
                    y
                },
                actor: {
                    desc, 
                    squadId,
                    teamId
                },
                display: {
                    draw,
                    frame: this.getFrame(desc)
                }
            }
        })
        
    }
}