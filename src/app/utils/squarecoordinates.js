/**
 * Converts chess square (a1, e4) to pixel coordinates
 * @param {string} square - Chess square (a1, h8)
 * @param {number} cellSize - Cell size in pixels
 * @returns {Object} {top, left} in pixels
 * @example squareCoordinates('e4', 50) // { top: 200, left: 200 }
 * 
*/export function squareCoordinates(square, cellSize, boardFlipped) {
    let top, left;
    if (!boardFlipped) {
        left = (square.charCodeAt(0) - 97) * cellSize;
        top = (8 - (+(square[1]))) * cellSize;
    }
    else {
        left = (104 - (square.charCodeAt(0))) * cellSize;
        top = ((+(square[1])) - 1) * cellSize;
    }
    return { top, left }
}

/**
* Converts pixel coordinates to chess square (a1, e4)
* @param {number} x - X coordinate in pixels
* @param {number} y - Y coordinate in pixels
* @param {number} squareSize - Square size in pixels
* @returns {string} Chess square notation (a1, h8)
* @example cooridinatesToSquare(100, 100, 50) // 'c6'
*/

export function cooridinatesToSquare(x, y, squareSize, boardFlipped) {
    let fileChar, rankNumber;
    if (!boardFlipped) {
        fileChar = String.fromCharCode(Math.floor(x / squareSize) + 97);
        rankNumber = 8 - Math.floor(y / squareSize);
    }

    else {
        fileChar = String.fromCharCode(104 - (Math.floor(x / squareSize)))
        rankNumber = Math.floor(y / squareSize) + 1;
    }
    return `${fileChar}${rankNumber}`;
}



