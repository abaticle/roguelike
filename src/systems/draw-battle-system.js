import ECS from "../lib/ecs";

export default class DrawBattleSystem {

    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
        this.drawn = false
    }


    getScene() {
        return this.ecs.get("Battle", "battle", "scene")
    }

    drawMap() {

        const {
            battle,
            map
        } = this.ecs.get("Battle")

        map.tilemap = this.getScene().make.tilemap({
            data: map.layout,
            tileWidth: 32,
            tileHeight: 32
        });

        const tiles = map.tilemap.addTilesetImage("ground1");
        const groundLayer = map.tilemap.createStaticLayer(0, tiles, 0, 0);
    }

    drawActors() {

        this.ecs.searchEntities(["display", "position", "actor"]).map(entityId => {

            const {
                actor,
                display,
                position
            } = this.ecs.get(entityId)            

            const scene = this.getScene()

            display.sprite = scene.add.sprite(0, 0, "monsters1", display.frame)
            display.container = scene.add.container((32 * position.x) + 16, (32 * position.y) + 16)
            display.container.add(display.sprite)

        })
    }

    update() {
        if (!this.drawn) {
            this.drawMap()
            this.drawActors()
            
            this.drawn = true
        }
        
    }
}