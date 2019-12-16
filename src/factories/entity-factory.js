import ECS from "../lib/ecs-helper";


export default class EntityFactory {
    constructor(ecs) {
        this.ecs = ecs
    }

    createActor(teamId = undefined, squadId = undefined, desc = "Soldier", x = 0, y = 0) {

        let entity = this.ecs.createEntity([
            "position",
            "actor",
            "display"
        ])

        let {
            position,
            actor,
            display
        } = this.ecs.get(entity)

        position.x = x
        position.y = y

        actor.desc = desc
        actor.teamId = teamId
        actor.squadId = squadId


        switch (desc) {
            case "Soldier":
                display.frame = 1
                break

            case "Archer":
                display.frame = 2
                break

            case "Gobelin":
                display.frame = 12
                break

        }        
    }
}