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
            // @ts-ignore
            allowDiagonal: true
        })
 

        //Set entities positions as not walkables
        this.ecs.actors
            .map(id => this.ecs.get(id))        
            .filter(({actor}) => actor.inBattle === true && actor.health > 0)
            .forEach(({position}) => {
                map.grid.setWalkableAt(position.x, position.y, false)
            });        
    }
}

export default PreparePathfindingSystem