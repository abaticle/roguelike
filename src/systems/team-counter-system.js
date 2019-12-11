class TeamCounterSystem {

    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }

    update() {
        const players = this.ecs.searchEntities("player")


        //Update player unit count
        players.forEach(playerId => {

            const player = this.ecs.get(playerId, "player")

            player.count = 0
            
            this.ecs.searchEntities("actor").forEach(actorId => {
                let actor = this.ecs.get(actorId, "actor")

                if (actor.teamId === playerId) {
                    if (actor.health > 0) {
                        player.count++
                    }
                }
            })

        });
    }
}

export default TeamCounterSystem