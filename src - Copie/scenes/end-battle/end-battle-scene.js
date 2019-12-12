export default class EndBattleScene extends Phaser.Scene {
    constructor() {
        super({
            key: "EndBattleScene"
        })
    }

    init(data) {
        let text = this.add.text(100, 100, '', { font: '64px Courier', fill: '#00ff00' });

        if (data.won) {
            text.setText("You win !")
        }

        else {
            text.setText("Game over !")
        }
    }

    create() {

    }


}