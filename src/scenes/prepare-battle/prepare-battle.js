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
        this.rexUI = undefined
    }

    /**
     * Create scene entity and UI
     */
    create() {
        this.createSceneEntity()
        this.createUI()
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


    /**
     * 
     * @param {EntityId} squadId 
     */
    onPlaceSquadClick(squadId) {
        const prepareBattle = this.getPrepareBattle()

        prepareBattle.placingSquadId = squadId

        prepareBattle.squadListUI.visible = false
        prepareBattle.squadConfirmUI.visible = true

    }


    onConfirmPlaceSquadClick(button, index, pointer, event) {
        
        console.log("confirm")
        const prepareBattle = this.getPrepareBattle()

        //Update inBattle flag
        this.ecs.getSquadUnits(prepareBattle.placingSquadId)
            .map(id => this.ecs.get(id))
            .forEach(data => {
                data.actor.inBattle = true
                data.display.draw = true
            })

        prepareBattle.placingSquadId = undefined
        
        prepareBattle.squadListUI.visible = true
        prepareBattle.squadConfirmUI.visible = false
    }

    onCancelPlaceSquadClick() {
        const prepareBattle = this.getPrepareBattle()

        prepareBattle.placingSquadId = undefined
        
        prepareBattle.squadListUI.visible = true
        prepareBattle.squadConfirmUI.visible = false
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
            
            text: this.add.text(0, 0, `${squadId}/${squad.desc} (${this.ecs.getSquadSize(squadId)})`, {
                fontSize: 18
            }),
            space: {
                left: 10,
                right: 10,
            }
        })


        let placeButton = this.rexUI.add.label({
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

        placeButton.setData("squadId", squadId)

        let buttons = this.rexUI.add.buttons({
            orientation: "x",
            buttons: [
                placeButton
            ]
        })


        buttons.on("button.click", (button, index, pointer, event) => {
            event.stopPropagation()

            if (index === 0) {                
                this.onPlaceSquadClick(button.getData("squadId"))
            }
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
            paddingConfig: 10,
            orientation: "y"
        })

        this.ecs.playerSquads.forEach(squadId => {
            sizer.add(this.getSquad(squadId))
        })

        return sizer        
    }

    /**
     * @returns {PrepareBattleComponent} 
     */
    getPrepareBattle() {
        return this.ecs.get("PrepareBattle", "prepareBattle")
    }

    createSquadConfirmUI() {


        let cancelButton = this.rexUI.add.label({
            width: 100,
            height: 40,
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, config.COLOR_BUTTON_BACKGROUND),
            text: this.add.text(0, 0, "Cancel", {
                fontSize: 18
            }),
            space: {
                left: 10,
                right: 10,
            }
        })

        let confirmButton = this.rexUI.add.label({
            width: 100,
            height: 40,
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, config.COLOR_BUTTON_CONFIRM),
            text: this.add.text(0, 0, "Confirm", {
                fontSize: 18
            }),
            space: {
                left: 10,
                right: 10,
            }
        })
        
        const buttonsWidth = 150
        const buttonsHeight = 600

        let buttons = this.rexUI.add.buttons({
            orientation: "x",
            width: 200,
            height: 80,
            anchor: {
                right: 'right-10',
                top: "top+10"
            },
            click: {
                mode: "release"
            },
            buttons: [
                cancelButton,
                confirmButton
            ]
        })
        .layout()


        buttons.on("button.click", (button, index, pointer, event) => {
            event.stopPropagation()
            
            switch (index) {
                case 0:
                    this.onCancelPlaceSquadClick()

                case 1:
                    this.onConfirmPlaceSquadClick()
            }
        })

        return buttons
    }

    createSquadListUI() {

        const panelWidth = 150
        const panelHeight = 600

        let panel = this.rexUI.add.scrollablePanel({
            anchor: {
                right: 'right-10',
                top: "top+10"
            },
            width: panelWidth,
            height: panelHeight,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, config.COLOR_PRIMARY),
            scrollMode: 0,
            panel: {
                child: this.getSquadList(),
                mask: {
                    padding: 1
                },
            },
            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, config.COLOR_DARK),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, config.COLOR_LIGHT),
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
        //.drawBounds(this.add.graphics(), )

        return panel
    }

    createUI() {
        const prepareBattle = this.getPrepareBattle()        

        prepareBattle.squadConfirmUI = this.createSquadConfirmUI()
        prepareBattle.squadConfirmUI.visible = false

        prepareBattle.squadListUI = this.createSquadListUI()
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