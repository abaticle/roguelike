export default class InputSystem {
    
    constructor(ecs) {
        this.ecs = ecs 
    }

    get pointer() {
        return this.ecs.scene.input.activePointer
    }

    update() {
        const scene = this.ecs.scene


    }
}