import Game from "./src/game"
import GameScene from "./src/scenes/game-scene"

window.onload = () => {
    const game = new Game({
        title: "Tests !",
        width: 800,
        height: 600,
        parent: "game",
        scene: [
            GameScene
        ]
    })
}