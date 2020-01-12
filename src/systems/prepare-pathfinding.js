import PF from "pathfinding"
import ECSHelper from "../lib/ecs-helper"

class PreparePathfindingSystem {

    /**
     * 
     * @param {ECSHelper} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }

    update() {

        //Initiate pathfinding grid
        const map = this.ecs.map

        map.grid = new PF.Grid(map.width, map.height)

        map.finder = new PF.AStarFinder({
            allowDiagonal: true
        })


        //Set entities positions as not walkables
        this.ecs.actors
            .map(id => this.ecs.get(id, "position"))        
            .forEach(position => {
                map.grid.setWalkableAt(position.x, position.y, false)
            });        
    }
}

export default PreparePathfindingSystem