import { Square } from "./Square";
export const BISHOP_DIRECTIONS = [
  { fileChange: -1, rankChange: 1 }, // top-left
  { fileChange: 1, rankChange: 1 }, // top-right
  { fileChange: -1, rankChange: -1 }, // bottom-left
  { fileChange: 1, rankChange: -1 }, // bottom-right
];
export const ROOK_DIRECTIONS = [
  { fileChange: 0, rankChange: 1 }, // up
  { fileChange: 0, rankChange: -1 }, // down
  { fileChange: 1, rankChange: 0 }, // right
  { fileChange: -1, rankChange: 0 }, // left
];
export const QUEEN_DIRECTIONS = [...BISHOP_DIRECTIONS, ...ROOK_DIRECTIONS];
export function calculateAttackedSquares(square, game, directions) {
  directions.forEach((direction) => {
    let currentSquare = square;
    while (true) {
      const nextSquare = game.getSquare(
        Square.changeFile(currentSquare.file, direction.fileChange),
        currentSquare.rank + direction.rankChange
      );
      if (nextSquare && !nextSquare.piece) {
        nextSquare.increaseAttackCount();
        currentSquare = nextSquare;
      } else {
        break;
      }
    }
  });
}
export function knightAttackedSquare(square, game) {
  const knightMoves = [
    { file: -2, rank: -1 },
    { file: -2, rank: 1 },
    { file: -1, rank: -2 },
    { file: -1, rank: 2 },
    { file: 1, rank: -2 },
    { file: 1, rank: 2 },
    { file: 2, rank: -1 },
    { file: 2, rank: 1 },
  ];
  knightMoves.forEach((move) => {
    try {
      const targetSquare = game.getSquare(
        Square.changeFile(square.file, move.file),
        square.rank + move.rank
      );
      if (targetSquare && !targetSquare.piece) {
        targetSquare.increaseAttackCount();
      }
    } catch (_a) {
      // Skip invalid squares
    }
  });
}

export const KING_DIRECTIONS = [
  { fileChange: -1, rankChange: -1 }, // down-left
  { fileChange: -1, rankChange: 0 },  // left
  { fileChange: -1, rankChange: 1 },  // up-left
  { fileChange: 0, rankChange: -1 },  // down
  { fileChange: 0, rankChange: 1 },   // up
  { fileChange: 1, rankChange: -1 },  // down-right
  { fileChange: 1, rankChange: 0 },   // right
  { fileChange: 1, rankChange: 1 },   // up-right
];

export function kingAttackedSquare(square, game) {
  KING_DIRECTIONS.forEach((move) => {
    try {
      const targetSquare = game.getSquare(
        Square.changeFile(square.file, move.fileChange),
        square.rank + move.rankChange
      );
      if (targetSquare && !targetSquare.piece) {
        targetSquare.increaseAttackCount();
      }
    } catch (_a) {
      // Skip invalid squares
    }
  });
}
