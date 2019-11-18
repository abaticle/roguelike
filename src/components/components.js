export const AiComponent = {
    name: "ai",
    mode: "melee" //melee/ranged
}

export const PositionComponent = {
    name: "position",
    x: 0,
    y: 0
}

export const ActorComponent = {
    name: "actor",
    desc: "Actor description", 
    health: 20,
    team: 0
} 

export const DisplayComponent = {
    name: "display",
    sprite: undefined,
    x: 0,
    y: 0
}

export const GameComponent = {
    name: "game",
    ui: undefined,
    speed: 1,
    turn: 0,
    actions: []
}

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
    DisplayComponent,
    GameComponent,
    MapComponent
]