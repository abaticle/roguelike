import PF from "pathfinding"

class PreparePathfindingSystem {
    constructor(ecs) {
        this.ecs = ecs
    }

    update() {

        //Initiate pathfinding grid
        const map = this.ecs.get("BattleScene", "map")

        map.grid = new PF.Grid(map.width, map.height)

        map.finder = new PF.AStarFinder({
            allowDiagonal: true
        })


        //Set entities positions as not walkables
        const actors = this.ecs.searchEntities([            
            "position", 
            "actor"
        ])

        actors.forEach(entityId => {
            const position = this.ecs.get(entityId, "position")

            map.grid.setWalkableAt(position.x, position.y, false)
        });        
    }
}

export default PreparePathfindingSystem