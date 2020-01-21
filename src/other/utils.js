import config from "../config";

export default class Utils {
    
    /** 
     * @property {MousePosition} pointFrom
     * @property {MousePosition} pointTo
     * @property {number} speed
     */
    static moveToward(pointFrom, pointTo, speed) {

        let tx = pointTo.x - pointFrom.x;
        let ty = pointTo.y - pointFrom.y;

        let dist = Math.sqrt(tx * tx + ty * ty);

        if (dist < speed) {
            dist = speed
        }

        let velX = (tx / dist) * speed;
        let velY = (ty / dist) * speed;

        return {
            x: pointFrom.x + velX,
            y: pointFrom.y + velY
        }
    }


    /**
     * Generate random integer between min and max (inclusives)
     * @param {number} min 
     * @param {number} max 
     */
    static randomInteger(min, max) {

        return Math.floor(Math.random() * (max - min + 1)) + min

    }

    /**
     * Get angle in degrees between 2 points
     * @param {position} center 
     * @param {position} position 
     */
    static getAngle(center, position) {
        return Math.atan2(position.y - center.y, position.x - center.x) * 180 / Math.PI;
    }

    static convertToPixelPosition(position) {
        
        return {
            x: ((position.x + 1) * config.TILE_SIZE) - config.TILE_MIDLE_SIZE,
            y: ((position.y + 1) * config.TILE_SIZE) - config.TILE_MIDLE_SIZE
        }
        
    }


    static getNextPositionFromAngle(position, angle) {

        switch (angle) {

            case 0:
            case -45:
                //bottom
                return {
                    x: position.x,
                    y: position.y + 1
                }

            case 45:
            case 90:
                //left
                return {
                    x: position.x - 1,
                    y: position.y
                }

            case 135:
            case 180:
                //top
                return {
                    x: position.x,
                    y: position.y - 1
                }
                break

            case -135:
            case -90:
                //right
                return {
                    x: position.x + 1,
                    y: position.y
                }
            
                default:
                throw new Error("Angle not managed", angle)
        }

    }

    /**
     * 
     * @param {object} center 
     * @param {number} center.x 
     * @param {number} center.y 
     * @param {object} pos 
     * @param {number} pos.x 
     * @param {number} pos.y 
     * @param {number} angle 
     */
    static rotate(center, pos, angle) {

        if (center === undefined) {
            throw new Error("center is undefined")
        }
        if (pos === undefined) {
            throw new Error("pos is undefined")
        }

        let radians = (Math.PI / 180) * angle;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let nx = (cos * (pos.x - center.x)) + (sin * (pos.y - center.y)) + center.x;
        let ny = (cos * (pos.y - center.y)) - (sin * (pos.x - center.x)) + center.y;

        return {
            x: nx,
            y: ny
        }
    }

    /**
     * 
     * @param {string} dice Dice number exemple 1D6+3 / 2D8-4
     */
    static parseDice(dice) {

    }


    /**
     * Get distance between 2 points
     * @param {number} xFrom 
     * @param {number} yFrom 
     * @param {number} xTo 
     * @param {number} yTo 
     */
    static distance(xFrom, yFrom, xTo, yTo) {

        return Math.sqrt(
            Math.pow((xFrom - xTo), 2) + Math.pow((yFrom - yTo), 2)
        );

    }


    static getPositionBetweenTwoPoints(xFrom, yFrom, xTo, yTo) {
        let xDist = xTo - xFrom
        let yDist = yTo - yFrom

        return {
            x: xFrom + xDist / 2,
            y: yFrom + yDist / 2
        }
    }

    static getRectanglePositions(xFrom, yFrom, xTo, yTo, filled = true) {

        let positions = []

        if (xFrom > xTo) {
            [xFrom, xTo] = [xTo, xFrom]
        }
        if (yFrom > yTo) {
            [yFrom, yTo] = [yTo, yFrom]
        }

        for (let x = xFrom; x <= xTo; x++) {
            for (let y = yFrom; y <= yTo; y++) {

                if (filled) {
                    positions.push({
                        x,
                        y
                    })
                }

                else {

                    throw new Error("todo !!")

                }

            }
        }


        return positions

    }

    static getLinePositions (from, to) {
        
        from.x = from.x < 0 ? 0 : from.x
        from.y = from.y < 0 ? 0 : from.y
        to.x = to.x < 0 ? 0 : to.x
        to.y = to.y < 0 ? 0 : to.y



        if (from === undefined) {
            throw new Error("from is undefined")
        }
        if (to === undefined) {
            throw new Error("to is undefined")
        }

        var coordinatesArray = new Array();

        var x1 = from.x;
        var y1 = from.y;
        var x2 = to.x;
        var y2 = to.y;

        // Define differences and error check
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var sx = (x1 < x2) ? 1 : -1;
        var sy = (y1 < y2) ? 1 : -1;
        var err = dx - dy;

        // Set first coordinates
        coordinatesArray.push({
            x: x1,
            y: y1
        });

        let count = 0
        while (!((x1 == x2) && (y1 == y2))) {
            count++

            if (count > 100) {
                console.warn("from: ", from, " to:", to)
                throw new Error("DUMP")
            }
            var e2 = err << 1;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }

            coordinatesArray.push({
                x: x1,
                y: y1
            });
        }
        
        return coordinatesArray;
    }


    /**
     * Generate a random map layout 
     * @param {number} width 
     * @param {number} height 
     * @return {number[number[]]}
     */
    static getRandomMapLayout(width = 50, height = 50) {

        let layout = []

        for (let i = 0; i < height; i++) {
            let row = []

            for (let j = 0; j < width; j++) {
                const randomInt = Utils.randomInteger(1, 100)

                if (randomInt < 2) {
                    row.push(1)
                }
                else if (randomInt < 4) {
                    row.push(0)
                }
                else {
                    row.push(2)
                }
            }

            layout.push(row)
        }

        return layout

    }


}