/**@type {TeamComponent} */
export const TeamComponent = {
    name: "team",
    desc: "",
    count: 0
}

/** @type {PositionComponent} */
export const PositionComponent = {
    name: "position",
    x: 0,
    y: 0
}

/** @type {SquadComponent} */
export const SquadComponent = {
    name: "squad",
    desc: "",
    placed: false,
    number: 1,
    teamId: undefined,
    ai: "melee"
}

/** @type {ActorComponent} */
export const ActorComponent = {
    name: "actor",
    desc: "Actor description", 
    health: 20,
    maxHealth: 20,
    teamId: undefined,
    squadId: undefined
} 

/** @type {DisplayComponent} */
export const DisplayComponent = {
    name: "display",
    container: undefined,
    selectorVisible: false,
    draw: false,
    frame: 0
}

/** @type {GameComponent} */
export const GameComponent = {
    name: "game",
    scene: undefined
}


/** @type {BattleComponent} */
export const BattleComponent = {
    name: "battle",
    newTurn: false,
    speed: 1,
    turn: 0,
    actions: [],
    selectedUnit: undefined,
    selectedSquad: undefined
}

/** @type {PrepareBattleComponent} */
export const PrepareBattleComponent = {
    name: "prepareBattle",
    placingSquadId: undefined,
    from: undefined,
    to: undefined,
    canConfirm: false,
    battleReady: false
}

/** @type {MapComponent} */
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