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
                return 5

            case "Archer":
                return 5

            case "Gobelin":
                return 5

        }        
    }

    /**
     * @param {Object} option Options
     * @param {number=} option.teamId Team entity Id
     * @param {number=} option.squadId Squad entity Id
     * @param {string=} option.desc Actor description
     * @param {number=} option.x X position on map
     * @param {number=} option.y Y position on map
     * @param {boolean=} option.draw Draw actor on scene ?
     * @param {boolean=} option.inBattle Actor in battle ?
     * @returns {EntityId} Entity created
     */
    createActor({teamId = undefined, squadId = undefined, desc = "Soldier", x = 0, y = 0, draw = true, inBattle = false}) {

        return this.ecs.createFromAssemblage({
            components: ["position", "actor", "display"],
            data: {
                position: {
                    x,
                    y
                },
                actor: {
                    desc, 
                    squadId,
                    teamId,
                    inBattle
                },
                display: {
                    draw,
                    frame: this.getFrame(desc)
                }
            }
        })
        
    }
}