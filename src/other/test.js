import ECS from "./../lib/ecs-helper"
import { Game } from "phaser"


const ecs = new ECS()


ecs.registerComponent({
    name: "myComp1",
    x: 0,
    y: 0
})
ecs.registerComponent({
    name: "myComp2",
    desc: ""
})


for (let i = 0; i < 10; i++) {

    ecs.createFromAssemblage({
        components: ["myComp1", "myComp2"],
        alias: "E" + i, 
        data: {
            myComp1: {
                x: i,
                y: 20
            },
            myComp2: {
                desc: "Entity " + i
            }
        }
    })

}


const entities = ecs.searchEntities("myComp1")

const getDataById = id => ecs.get(id)


let data = entities
    .map(getDataById)
    .filter()


console.log(data)

export default {}