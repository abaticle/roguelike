export default {
    
    
    distance(xFrom, yFrom, xTo, yTo) {

        return Math.sqrt(
            Math.pow((xFrom - xTo), 2) + Math.pow((yFrom - yTo), 2)
        );

    }
}