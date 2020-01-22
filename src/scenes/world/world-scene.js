import SceneBase from "../scene-base"
import ECSHelper from "../../lib/ecs-helper";


class AlignGrid {
    constructor(config) {
        if (!config.scene) {
            console.log("missing scene!");
            return;
        }
        if (!config.rows) {
            config.rows = 3;
        }
        if (!config.cols) {
            config.cols = 3;
        }
        if (!config.width) {
            config.width = window.innerWidth;
        }
        if (!config.height) {
            config.height = window.innerHeight;
        }
        this.h = config.height;
        this.w = config.width;
        this.rows = config.rows;
        this.cols = config.cols;        
        this.scene = config.scene;       
        
        //Cell width/height
        this.cw = this.w / this.cols;
        this.ch = this.h / this.rows;
    }

    show(a = 1) {
        this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(4, 0xaa0000, a);
        
        for (var i = 0; i < this.w; i += this.cw) {
            this.graphics.moveTo(i, 0);
            this.graphics.lineTo(i, this.h);
        }

        for (var i = 0; i < this.h; i += this.ch) {
            this.graphics.moveTo(0, i);
            this.graphics.lineTo(this.w, i);
        }

        this.graphics.strokePath();
    }    
}

/**
 * @extends {SceneBase}
 */
export default class WorldScene extends SceneBase {

    /**
     * 
     * @param {ECSHelper} ecs 
     * @param {object} systems 
     */
    constructor(ecs, systems) {
        super({
            key: "World",
            ecs,
            systems
        })        
    }

    create() {
        this.createSceneEntity()
        
        this.scene.start("PrepareBattle")
    }

    createSceneEntity() {
        this.ecs.createFromAssemblage({
            components: ["world"],
            alias: "World"
        })
        
    }

}