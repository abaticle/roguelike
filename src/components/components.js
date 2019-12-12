import PF from "pathfinding"

/**
 * @typedef {object} ActorComponent Player component
 * @property {string} name Component name
 * @property {string} desc Player description
 * @property {boolean} controled Controled by user ?
 * @property {number} count Number of units
 */
export const PlayerComponent = {
    name: "player",
    desc: "",
    controled: false,
    count: 0
}

export const AiComponent = {
    name: "ai",
    mode: "melee" //melee/ranged
}

export const PositionComponent = {
    name: "position",
    x: 0,
    y: 0
}

export const SquadComponent = {
    name: "squad",
    desc: "",
    teamId: undefined
}

/**
 * @typedef {object} ActorComponent Actor component
 * @property {string} name Component name
 * @property {string} desc Actor description
 * @property {number} health Actor health
 * @property {number} teamId Actor team entity id
 * @property {number} squadId Actor squad entity id
 */
export const ActorComponent = {
    name: "actor",
    desc: "Actor description", 
    health: 20,
    teamId: undefined,
    squadId: undefined
} 


export const DisplayComponent = {
    name: "display",
    sprite: undefined,
    container: undefined,
    x: 0,
    y: 0
}

export const GameComponent = {
    name: "game"
}

export const BattleComponent = {
    name: "battle",
    scene: undefined,
    ui: undefined,
    speed: 1,
    turn: 0,
    actions: [],
    scene: undefined,
    mapWidth: 0,
    mapHeigth: 0
}

/**
 * @typedef {object} MapComponent Map component
 * @property {number} width Map width
 * @property {number} height Map height
 * @property {number[]} layout Map layout
 * @property {Phaser.Tilemaps.Tilemap} tilemap Phaser tilemap
 * @property {PF.Grid} grid PathFinding Grid
 * @property {} finder 
 */
export const MapComponent = {
    name: "map",
    width: 0,
    height: 0,
    layout: [],
    tilemap: undefined,
    grid: undefined,
    finder: undefined
}

export const AllComponent = [
    AiComponent,
    PositionComponent,
    ActorComponent,
    SquadComponent,
    DisplayComponent,
    MapComponent,
    PlayerComponent,
    GameComponent,
    BattleComponent
]