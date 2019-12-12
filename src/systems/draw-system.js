import ECS from "../lib/ecs";

class DrawSystem {

    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }

    drawMap() {
        const map = this.ecs.getCurrentMap()

        map.tilemap = this.make.tilemap({
            data: map.layout,
            tileWidth: 32,
            tileHeight: 32
        });

        const tiles = map.tilemap.addTilesetImage("ground1");
        const groundLayer = map.tilemap.createStaticLayer(0, tiles, 0, 0);
    }

    update() {

    }
}

export default DrawSystem