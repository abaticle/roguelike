import ECS from "./ecs"
import Utils from "./../other/utils"

class ECSHelper {

    /**
     * Class to help with ecs engine
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }   


    /**
     * Get path between two points
     * @param {number} xFrom 
     * @param {number} yFrom 
     * @param {number} xTo 
     * @param {number} yTo 
     * @returns {number[]} Array of [x, y] coordinates
     */
    findPath(xFrom, yFrom, xTo, yTo) {
        //const map = this.ecs.get("Map", "map")

        const {
            finder,
            grid
        } = this.ecs.get("Map", "map")

        grid.setWalkableAt(xTo, yTo, true)
        
        let path = finder.findPath(xFrom, yFrom, xTo, yTo, grid.clone())
        
        grid.setWalkableAt(xTo, yTo, false)

        return path
    }


    /**
     * Set position as walkable/not walkable on map
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} walkable 
     */
    setWalkable(x, y, walkable) {
        const grid = this.ecs.get("Map", "map", "grid")

        grid.setWalkableAt(x, y, walkable)
    }



    /**
     * Get next position toward an entity
     * @param {number} entityFromId 
     * @param {number} entityToId 
     */
    getNextPositionTowardEntity(entityFromId, entityToId) {
        const positionFrom = this.ecs.get(entityFromId, "position")
        const positionTo = this.ecs.get(entityToId, "position")


        let path = this.findPath(positionFrom.x, positionFrom.y, positionTo.x, positionTo.y)

        if (path.length > 1) {
            return {
                x: path[1][0],
                y: path[1][1]
            }
        }

        else {
            return undefined
        }

    }


    /**
     * Get map width
     * @returns {number} Get map width
     */
    getMapWidth() {
        return this.ecs.get("Map", "map", "width")
    }

    /**
     * Get map height
     * @returns {number} Get map height
     */
    getMapHeight() {
        return this.ecs.get("Map", "map", "height")
    }

    /**
     * Get possible position around entity
     * @param {Position[]} entityId 
     */
    getAroundPositions(entityId) {
        const position = this.ecs.get(entityId, "position")

        let positions = []

        for (let x = (position.x - 1); x <= (position.x + 1); x++) {
            for (let y = (position.y - 1); y <= (position.y + 1); y++) {

                if (x !== position.x || y !== position.y) {

                    if (x >= 0 && x < this.getMapWidth()) {
                        if (y >= 0 && y < this.getMapHeight()) {
                            positions.push({
                                x,
                                y
                            })
                        }
                    }                    
                }
            }
        }

        return positions        
    }

    /**
     * Get enemy entities
     * @param {number} friendlyEntityId Friendly unit id
     * @returns {number[]} Enemy entities
     */
    getEnemies(friendlyEntityId) {
        const friendlyActor = this.ecs.get(friendlyEntityId, "actor")

        return this.ecs.searchEntities("actor").filter(entityId => {
            if (this.ecs.get(entityId, "actor", "team") !== friendlyActor.team) {
                return true
            }
            return false
        })
    }


    /**
     * Get closest entity enemy
     * @param {number} friendlyEntityId Entity to search from 
     * @returns {number} Closest enemy
     */
    getClosestEnemyUnit(friendlyEntityId) {

        const unitPosition = this.ecs.get(friendlyEntityId, "position")

        let maxDistance = 9999
        let enemy = -1

        this.getEnemies(friendlyEntityId).forEach(enemyEntityId => {
            const enemyPosition = this.ecs.get(enemyEntityId, "position")

            let newDistance = Utils.distance(unitPosition.x, unitPosition.y, enemyPosition.x, enemyPosition.y)

            if (newDistance < maxDistance) {
                maxDistance = newDistance
                enemy = enemyEntityId
            }
        })

        if (enemy === -1) {
            return undefined
        }

        return enemy

    }

    /**
     * 
     * @param {number} friendlyEntityId 
     * @returns {number|undefined}
     */
    getProximityEnemyUnit(friendlyEntityId) {

        let entities = this.getProximityEnemyUnits(friendlyEntityId) 

        if (entities.length > 0) {
            return entities[0]
        }

        return undefined

    }   


    /**
     * 
     * @param {number} friendlyEntityId 
     * @returns {number[]} Blocking entities
     */
    getProximityEnemyUnits(friendlyEntityId) {
        const enemyActors = this.getEnemies(friendlyEntityId)

        const friendlyPosition = this.ecs.get(friendlyEntityId, "position")
        const friendlyPossiblePositions = this.getAroundPositions(friendlyEntityId)

        return enemyActors.filter(enemyEntityId => {
            const enemyPosition = this.ecs.get(enemyEntityId, "position")

            const found = friendlyPossiblePositions.find(position => {
                if (position.x === enemyPosition.x && position.y === enemyPosition.y) {
                    return true 
                }
                return false
            })

            if (found) {
                return true 
            }

            return false
        })
    }
}

export default ECSHelper