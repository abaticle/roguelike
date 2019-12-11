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

    getEntityAtMousePosition(position, alive = true) {
        const pos = {
            x: parseInt(position.x / 32),
            y: parseInt(position.y / 32) 
        }

        return this.getEntityAtPosition(pos, alive)
    }

    /**
     * Search entity by position
     * @param {Object} position 
     * @param {number} position.x
     * @param {number} position.y
     * @param {boolean} alive 
     * @returns {number|undefined} Entity found or undefined
     */
    getEntityAtPosition(position, alive = true) {
        
        const x = position.x
        const y = position.y 

        return this.ecs.searchEntities(["actor", "position"]).find(entityId => {
            const {
                position,
                actor
            } = this.ecs.get(entityId)

            if (position.x === x && position.y === y) {
                if (alive && actor.health > 0) {
                    return true
                }
                if (!alive) {
                    return true
                }
                return false
                
            }

            return false
        })
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
     * @param {number} x X Position
     * @param {number} y Y Position
     * @param {boolean} walkable Walkable or not
     */
    setWalkable(x, y, walkable) {
        const grid = this.ecs.get("Map", "map", "grid")

        grid.setWalkableAt(x, y, walkable)
    }


    /**
     * Check position is walkable
     * @param {number} x X Position
     * @param {number} y Y Position
     */
    getWalkable(x, y) {
        const grid = this.ecs.get("Map", "map", "grid")
        
        return grid.isWalkableAt(x, y)
    }

    /**
     * Get flee position toward an entity
     * @param {number} entityFromId 
     * @param {number} entityToId 
     */
    getOpositePositionTowardEntity(entityFromId, entityToId) {
        const positionFrom = this.ecs.get(entityFromId, "position")
        const positionTo = this.ecs.get(entityToId, "position")


        //Get all position arround entity
        const aroundPositions = this.getAroundPositions(entityFromId)

        //Get longest distance from target from theses positions
        let range = 0
        let positionToReturn

        aroundPositions.forEach(position => {

            let distance = Utils.distance(position.x, positionTo.x, position.y, positionTo.y)

            if (distance > range) {
                positionToReturn = {
                    x: position.x,
                    y: position.y
                }
                range = distance
            }
        })

        return positionToReturn

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
     * Get possible walkables position around entity
     * @param {number} entityId Entity id
     * @returns {Position[]} entityId 
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
     * Get enemy entities with health > 0
     * @param {number} friendlyEntityId Friendly unit id
     * @returns {number[]} Enemy entities
     */
    getEnemies(friendlyEntityId) {
        const friendlyActor = this.ecs.get(friendlyEntityId, "actor")

        return this.ecs.searchEntities("actor").filter(entityId => {
            const actor = this.ecs.get(entityId, "actor")

            if (actor.health > 0 && actor.teamId !== friendlyActor.teamId) {
                return true
            }
            return false
        })
    }


    


    /**
     * Get closest entity enemy
     * @param {number} friendlyEntityId Entity to search from 
     * @param {number} range Maximum range
     * @returns {number} Closest enemy
     */
    getClosestEnemyUnit(friendlyEntityId, range = 9999) {

        const unitPosition = this.ecs.get(friendlyEntityId, "position")

        let enemy = -1

        this.getEnemies(friendlyEntityId).forEach(enemyEntityId => {
            const enemyPosition = this.ecs.get(enemyEntityId, "position")

            let newDistance = Utils.distance(unitPosition.x, unitPosition.y, enemyPosition.x, enemyPosition.y)

            if (newDistance < range) {
                range = newDistance
                enemy = enemyEntityId
            }
        })

        if (enemy === -1) {
            return undefined
        }

        return enemy

    }


    /**
     * Get distance between 2 entities
     * @param {number} entityFrom 
     * @param {number} entityTo 
     * @returns {number} Distance 
     */
    getDistanceBetweenEntities(entityFrom, entityTo) {
        const entityFromPosition = this.ecs.get(entityFrom, "position")
        const entityToPosition = this.ecs.get(entityTo, "position")

        return Utils.distance(entityFromPosition.x, entityFromPosition.y, entityToPosition.x, entityToPosition.y)
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
        const friendlyPossiblePositions = this.getAroundPositions(friendlyEntityId)

        let result = enemyActors.filter(enemyEntityId => {
            
            const ownPosition = this.ecs.get(friendlyEntityId, "position")
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

        return result
    }
}

export default ECSHelper