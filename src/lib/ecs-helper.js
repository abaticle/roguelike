import ECS from "./ecs"
import Utils from "./../other/utils"
import { MapComponent } from "../components/components"
import Config from "../config"

class ECSHelper extends ECS {

    constructor() {
        super()
    }   
    
    /**
     * @returns {MapComponent}
     */
    getCurrentMap() {
        const entityId = this.searchEntities("map")[0]

        return this.get(entityId, "map")
    }



    drawActors(scene) {

        this.searchEntities("actor")

    }


    drawEntity(scene, entityId) {
    
        const {
            display,
            position
        } = this.get(entityId)

        let pixelPosition = Utils.convertToPixelPosition(position)

        display.x = pixelPosition.x
        display.y = pixelPosition.y

        display.sprite = scene.add.sprite(0, 0, "monsters1", display.frame)
        
        display.container = scene.add.container(display.x, display.y)
        display.container.add(display.sprite)     
        
    }


    /**
     * Draw a map in a scene
     * @param {Phaser.Scene} scene 
     * @param {MapComponent} map 
     */
    drawMap(scene, map) {

        map.tilemap = scene.make.tilemap({
            data: map.layout,
            tileWidth: 32,
            tileHeight: 32
        });        
        
        const tiles = map.tilemap.addTilesetImage("ground1");
        
        map.tilemap.createStaticLayer(0, tiles, 0, 0);
    }


    /**
     * Get formation positions
     * @param {position} from From
     * @param {position} to To
     * @param {position} size Number of units to place
     * @returns {position[]} Positions
     */
    getFormationPositions(from, to, size) {

        let positions = Utils.getLinePositions(from, to)

        //Only one position
        if (positions.length <= 1) {
            return positions
        }

        //One line is enough
        if (positions.length >= size) {
            positions.splice(size)
            return positions
        }

        //Else add lines unless ennough positions
        let filled = false
        let lineCount = 0
        let lineLength = positions.length

        while (filled === false) {

            const firstPos = lineCount * lineLength
            const lastPos = (lineCount * lineLength) + (lineLength - 1)
            
            let angle = Utils.getAngle(positions[firstPos], positions[firstPos + 1])

            const lineFrom = Utils.getNextPositionFromAngle(positions[firstPos], angle)            
            const lineTo = Utils.getNextPositionFromAngle(positions[lastPos], angle)        

            let newPositions = Utils.getLinePositions(lineFrom, lineTo)

            positions = positions.concat(newPositions)

            if (positions.length >= size) {
                positions.splice(size)
                filled = true
            }

            lineCount++

            if (lineCount === 4) {
                filled = true
            }
        }

        return positions
    }

    
    /**
     * Get world position from mouse
     * @param {Object} position Mouse position
     * @param {number} position.x Mouse x position
     * @param {number} position.y Mouse y position
     */
    convertWorldPos(position) {
        const pos = {
            x: parseInt(position.x / Config.TILE_SIZE),
            y: parseInt(position.y / Config.TILE_SIZE) 
        }

        return pos
    }


    /**
     * Call getEntityAtPosition under the hood
     * @param {Object} position Mouse position
     * @param {number} position.x Mouse x position
     * @param {number} position.y Mouse y position
     * @param {boolean} alive 
     */
    getEntityAtMousePosition(position, alive = true) {
        const pos = this.convertWorldPos(position)

        return this.getEntityAtPosition(pos, alive)
    }


    /**
     * Search entity by position
     * @param {Object} position Map position
     * @param {number} position.x Map x position
     * @param {number} position.y Map y position
     * @param {boolean} alive Unit with health ?
     * @returns {number|undefined} Entity found or undefined
     */
    getEntityAtPosition(position, alive = true) {
        
        const x = position.x
        const y = position.y 
        
        return this.searchEntities(["actor", "position"]).find(entityId => {

            const {
                position,
                actor
            } = this.get(entityId)            

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
     * Get all units from squad
     * @param {number} squadId Squad entity id
     * @returns {number[]} Entities
     */
    getSquadUnits(squadId) {

        return this
            .searchEntities("actor")
            .filter(entityId => this.get(entityId, "actor", "squadId") === squadId)

    }

    
    /**
     * Get squad size
     * @param {number} squadId Squad entity id
     * @returns {number} Squad size
     */
    getSquadSize(squadId) {

        return this.getSquadUnits(squadId).length

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
        
        const map = this.getCurrentMap()

        map.grid.setWalkableAt(xTo, yTo, true)
        
        let path = map.finder.findPath(xFrom, yFrom, xTo, yTo, map.grid.clone())
        
        map.grid.setWalkableAt(xTo, yTo, false)

        return path
    }


    /**
     * Set position as walkable/not walkable on map
     * @param {number} x X Position
     * @param {number} y Y Position
     * @param {boolean} walkable Walkable or not
     */
    setWalkable(x, y, walkable) {
        const map = this.getCurrentMap()

        map.grid.setWalkableAt(x, y, walkable)
    }


    /**
     * Check position is walkable
     * @param {number} x X Position
     * @param {number} y Y Position
     */
    getWalkable(x, y) {
        const map = this.getCurrentMap()
        
        return map.grid.isWalkableAt(x, y)
    }

    /**
     * Get flee position toward an entity
     * @param {number} entityFromId 
     * @param {number} entityToId 
     */
    getOpositePositionTowardEntity(entityFromId, entityToId) {
        const positionFrom = this.get(entityFromId, "position")
        const positionTo = this.get(entityToId, "position")


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
        const positionFrom = this.get(entityFromId, "position")
        const positionTo = this.get(entityToId, "position")

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
    getCurrentMapWidth() {
        return this.get(this.getCurrentMap(), "map", "width")
    }

    /**
     * Get map height
     * @returns {number} Get map height
     */
    getCurrentMapHeight() {
        return this.get(this.getCurrentMap(), "map", "height")
    }

    /**
     * Get possible walkables position around entity
     * @param {number} entityId Entity id
     * @returns {Position[]} entityId 
     */
    getAroundPositions(entityId) {
        const position = this.get(entityId, "position")

        let positions = []

        for (let x = (position.x - 1); x <= (position.x + 1); x++) {
            for (let y = (position.y - 1); y <= (position.y + 1); y++) {

                if (x !== position.x || y !== position.y) {

                    if (x >= 0 && x < this.getCurrentMap().width) {
                        if (y >= 0 && y < this.getCurrentMap().height) {

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
        const friendlyActor = this.get(friendlyEntityId, "actor")

        return this.searchEntities("actor").filter(entityId => {
            const actor = this.get(entityId, "actor")

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

        const unitPosition = this.get(friendlyEntityId, "position")

        let enemy = -1

        this.getEnemies(friendlyEntityId).forEach(enemyEntityId => {
            const enemyPosition = this.get(enemyEntityId, "position")

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
        const entityFromPosition = this.get(entityFrom, "position")
        const entityToPosition = this.get(entityTo, "position")

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
            
            const ownPosition = this.get(friendlyEntityId, "position")
            const enemyPosition = this.get(enemyEntityId, "position")

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