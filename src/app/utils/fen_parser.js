/**
 * Parses a FEN (Forsyth–Edwards Notation) string and returns an object representing piece positions on a chess board.
 * 
 * @param {string} fen - The FEN string to parse (e.g., "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
 * @returns {Object} An object where keys are square coordinates (e.g., "a1", "e4") and values are piece symbols
 *                   (K=white king, k=black king, Q=white queen, q=black queen, etc.)
 * 
 * @example
 * // Starting position FEN
 * parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
 * // Returns:
 * // {
 * //   a8: 'r', b8: 'n', c8: 'b', d8: 'q', e8: 'k', f8: 'b', g8: 'n', h8: 'r',
 * //   a7: 'p', b7: 'p', c7: 'p', d7: 'p', e7: 'p', f7: 'p', g7: 'p', h7: 'p',
 * //   a2: 'P', b2: 'P', c2: 'P', d2: 'P', e2: 'P', f2: 'P', g2: 'P', h2: 'P',
 * //   a1: 'R', b1: 'N', c1: 'B', d1: 'Q', e1: 'K', f1: 'B', g1: 'N', h1: 'R'
 * // }
 */
export function parseFen(fen) {
    const piecesPosition = {}
    const ranks = fen.split(" ")[0].split("/");
    ranks.forEach((pieces, index) => {
        const currentRank = 8 - index;
        let fileIndex = 0;
        pieces.split("").forEach((piece) => {
            if (Number(piece)) {
                fileIndex += Number(piece)
            }
            else {
                let currentFile = String.fromCharCode(97 + fileIndex);
                let squareCoordinate = `${currentFile}${currentRank}`
                piecesPosition[squareCoordinate] = piece
                fileIndex++
            }
        })
    })
    return piecesPosition
}

export function countChessPieces(fen) {
    // Extract the board part of the FEN notation (first part before the first space)
    const board = fen.split(' ')[0];
    const pieceCounts = {
        blackPieces: 0,
        whitePieces: 0,
        totalPieces: 0
    };

    const blackPiecesSet = new Set(['p', 'r', 'n', 'b', 'q', 'k']);
    const whitePiecesSet = new Set(['P', 'R', 'N', 'B', 'Q', 'K']);

    for (const char of board) {
        if (blackPiecesSet.has(char)) {
            pieceCounts.blackPieces++;
        } else if (whitePiecesSet.has(char)) {
            pieceCounts.whitePieces++;
        }
    }

    pieceCounts.totalPieces = pieceCounts.blackPieces + pieceCounts.whitePieces;
    return pieceCounts;
}