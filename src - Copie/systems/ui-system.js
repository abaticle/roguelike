import ECS from "./../lib/ecs"

class UISystem {
    
    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs
    }

    update() {
        let ui = this.ecs.get("BattleScene", "battleScene", "ui")            
        
        ui.update()        
    }
}

export default UISystem