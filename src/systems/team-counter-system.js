import ECS from "./../lib/ecs-helper"


class TeamCounterSystem {

    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }

    update() {

        //Update player unit count
        this.ecs.teams
            .map(id => this.ecs.get(id, "team"))
            .forEach(team => {

                team.count = 0

                this.ecs.actors
                    .map(id => this.get(id, "actor"))
                    .filter(actor => actor.teamId === team && actor.health > 0)
                    .length
                

            });
    }
}

export default TeamCounterSystem