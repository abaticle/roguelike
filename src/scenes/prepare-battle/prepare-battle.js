import ECS from "./../../lib/ecs-helper"
import PrepareBattleUI from "./../../scenes/prepare-battle/prepare-battle-ui";
import SceneBase from "../scene-base"
import m from "mithril"
import config from "../../config";


export default class PrepareBattle extends SceneBase {

    /**
     * 
     * @param {ECS} ecs 
     * @param {object} systems 
     */
    constructor(ecs, systems) {
        super({
            key: "PrepareBattle",
            ecs,
            systems,
            ui: PrepareBattleUI
        })
        this.UIDrawn = false
    }

    /**
     * Create scene entity and UI
     */
    create() {
        this.createSceneEntity()
        this.createUI()
    }

    button(scene, text) {

        return scene.rexUI.add.label({
            //width: 100,
            height: 40,
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, 0x7b5e57),
            text: scene.add.text(0, 0, text, {
                fontSize: 18
            }),
            space: {
                left: 10,
                right: 10,
            }
        });        
    }

    preload() {

        this.load.scenePlugin({
            key: "rexuiplugin",
            url: "assets/rexuiplugin.min.js",
            sceneKey: "rexUI"
        });

    }
    /**
     * Create scene entity
     */
    createSceneEntity() {
        this.ecs.createFromAssemblage({
            components: ["prepareBattle"],
            alias: "PrepareBattle",
            
            //TODO:Tests à retirer
            data: {
                prepareBattle: {
                    battleReady: true
                }
            }
        })
    }


    getSquad(squadId) {


        const {
            squad 
        } = this.ecs.get(squadId)

        
        let title = this.rexUI.add.label({
            height: 40,
            anchor: {
                centerX: "left"
            },
            
            text: this.add.text(0, 0, `${squad.desc} (${this.ecs.getSquadSize(squadId)})`, {
                fontSize: 18
            }),
            space: {
                left: 10,
                right: 10,
            }
        })


        let placeButton = this.rexUI.add.buttons({
            orientation: "x",
            buttons: [
                this.rexUI.add.label({
                    width: 100,
                    height: 40,
                    background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, config.COLOR_BUTTON_BACKGROUND),
                    text: this.add.text(0, 0, "Place", {
                        fontSize: 18
                    }),
                    space: {
                        left: 10,
                        right: 10,
                    }                    
                })
            ]
        })



        return this.rexUI.add.sizer({
            orientation: "y"
        })
        .add(title)
        .add(
            this.rexUI.add.sizer({
                align: "left",
                orientation: "x",   
                space: {
                    left: 10,
                    right: 10,
                }
            })
            .add(placeButton)
        )

    }

    getSquadList() {

        const sizer = this.rexUI.add.sizer({
            align: "left",
            paddingConfig: 30,
            orientation: "y"
        })


        this.ecs.playerSquads.forEach(squadId => {
            sizer.add(this.getSquad(squadId))
        })


        return sizer
        
    }

    createUI() {

        const COLOR_PRIMARY = 0x4e342e
        const COLOR_LIGHT = 0x7b5e57
        const COLOR_DARK = 0x260e04
        const COLOR_BOUND = 0xff0000

        this.rightPanel = this.rexUI.add.scrollablePanel({
            anchor: {
                //left: 'right-200',
                centerY: 'center',
                centerX: "right-200"
            },
            width: 300,
            height: 820,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),
            scrollMode: 0,
            panel: {
                child: this.getSquadList(),
                mask: {
                    padding: 1
                },
            },
            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
            },
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                panel: 10,
            }   


        })
        .layout()
        .drawBounds(this.add.graphics(), COLOR_BOUND)

        window.rightPanel = this.rightPanel
    }

    /**
     * Create DOM
     */
    createUIOld() {

        this.ui.init(this.ecs)

        m.mount(document.getElementById("ui"), this.ui)

    }

    update() {
        this.systems.draw.update()
        this.systems.input.update()

        if (!this.UIDrawn) {
            this.UIDrawn = true
            this.createUI()
        }

        //this.ui.redraw()
    }
}