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




}