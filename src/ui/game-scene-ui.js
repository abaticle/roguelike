export default class GameSceneUI {

    /**
     * 
     * @param {GameScene} scene 
     */
    constructor(scene) {
        this.scene = scene
        this.ecs = scene.ecs

        this.message = ""

        this.comp = {
            oninit: () => {

            },
            view: () => {
                return m("#app", [
                    m("button", {
                        onclick: () => {
                            this.scene.turn()
                        }
                    }, "Next turn"),
                    m("div", this.message)
                ])
            }
        }

        m.mount(document.getElementById("ui"), this.comp)
    }


    updateMessage(message) {
        this.message = JSON.stringify(message)
    }

}