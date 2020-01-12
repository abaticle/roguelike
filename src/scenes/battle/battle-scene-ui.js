import { BattleComponent } from "../../components/components";
import ECSHelper from "../../lib/ecs-helper";

/** @type {ECSHelper} */
let ecs

/** @type {BattleComponent} */
let battle


const onNewTurnClick = () => {
    ecs.set(true, "Battle", "battle", "newTurn")
}

const BattleSceneUI = {

    init:(ecsParam) => {
        ecs = ecsParam
        battle = ecs.get("Battle", "battle")
    },

    redraw: () => {
        m.redraw()
    },

    view: () => {

        return m(".right-panel", [
            m("button", {
                onclick: () => onNewTurnClick() 
            }, "Next turn"),
            
            m("div", [
                m("table.pure-table", {
                    class: battle.selectedSquad === undefined ? "hidden" : ""
                }, [
                    m("tr", [
                        m("td", "Squad"), 
                        m("td", "todo squad desc")
                    ])
                ])
            ]),

            m("div", [
                m("table.pure-table", {
                    class: battle.selectedUnit === undefined ? "hidden" : ""
                }, [
                    m("tr", [
                        m("td", "Unit"), 
                        m("td", "todo unit desc")
                    ])
                ])
            ])
        ]) 
    }

}

export default BattleSceneUI

