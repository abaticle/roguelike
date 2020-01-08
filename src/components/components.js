import PF from "pathfinding"

/**
 * @typedef {object} ActorComponent Player component
 * @property {string} name Component name
 * @property {string} desc Player description
 * @property {boolean} controled Controled by user ?
 * @property {number} count Number of units
 */
export const TeamComponent = {
    name: "team",
    desc: "",
    count: 0
}

/**
 * @typedef {object} PositionComponent Position component
 * @property {number} x X Position
 * @property {number} y Y Position
 */
export const PositionComponent = {
    name: "position",
    x: 0,
    y: 0
}

/**
 * @typedef {object} SquadComponent Squad component
 * @property {string} name Component name
 * @property {string} desc Actor description
 * @property {boolean} placed 
 * @property {number} number Squad number
 * @property {number} teamId Squad team entity id
 * @property {string} ai Squad AI
 */
export const SquadComponent = {
    name: "squad",
    desc: "",
    placed: false,
    number: 1,
    teamId: undefined,
    ai: "melee"
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
    maxHealth: 20,
    teamId: undefined,
    squadId: undefined
} 

/**
 * @typedef {object} DisplayComponent Actor component
 * @property {string} name Component name
 * @property {Phaser.GameObjects.Sprite} sprite Phaser sprite
 * @property {Phaser.GameObjects.Container} container Phaser container
 * @property {boolean} selectorVisible Selector visible ?
 * @property {boolean} draw Draw component ?
 * @property {number} frame Frame id
 */
export const DisplayComponent = {
    name: "display",
    sprite: undefined,
    container: undefined,
    selectorVisible: false,
    draw: false,
    frame: 0
}

export const GameComponent = {
    name: "game",
    scene: undefined
}

export const BattleComponent = {
    name: "battle",
    newTurn: false,
    scene: undefined,
    ui: undefined,
    speed: 1,
    turn: 0,
    actions: []
}

export const PrepareBattleComponent = {
    name: "prepareBattle",
    scene: undefined,
    ui: undefined
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



const Components = [
    PositionComponent,
    ActorComponent,
    SquadComponent,
    DisplayComponent,
    MapComponent,
    TeamComponent,
    GameComponent,
    BattleComponent,
    PrepareBattleComponent
]

export default Components