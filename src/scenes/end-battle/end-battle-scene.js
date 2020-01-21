import SceneBase from "../scene-base";
import ECSHelper from "../../lib/ecs-helper";

export default class EndBattleScene extends SceneBase {

    /**
     * 
     * @param {ECSHelper} ecs 
     * @param {object} systems 
     */
    constructor(ecs, systems) {
        super({
            key: "EndBattle",
            ecs,
            systems
        })

        this.ecs = ecs
        this.systems = systems
    }

    /**
     * 
     * @param {object=} data 
     * @param {boolean=} data.won
     */
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