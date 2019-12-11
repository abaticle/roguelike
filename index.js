import BattleScene from "./src/scenes/battle/battle-scene"
import EndBattleScene from "./src/scenes/end-battle/end-battle-scene"

window.onload = () => {
    new Phaser.Game({
        title: "Tests !",
        width: window.innerWidth,
        height: window.innerHeight,
        parent: "game",
        scene: [
            BattleScene,
            EndBattleScene
        ]
    })
}