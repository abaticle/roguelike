export default class Utils {
    

    /**
     * Generate random integer between min and max (inclusives)
     * @param {number} min 
     * @param {number} max 
     */
    static randomInteger(min, max) {

        return Math.floor(Math.random() * (max - min + 1)) + min

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

    static getLinePositions (startCoordinates, endCoordinates) {

        var coordinatesArray = new Array();

        var x1 = startCoordinates.x;
        var y1 = startCoordinates.y;
        var x2 = endCoordinates.x;
        var y2 = endCoordinates.y;

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


        while (!((x1 == x2) && (y1 == y2))) {
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


}