import { Square } from "./Square";
import {
  BISHOP_DIRECTIONS,
  ROOK_DIRECTIONS,
  QUEEN_DIRECTIONS,
  calculateAttackedSquares,
  knightAttackedSquare,
  kingAttackedSquare,
} from "./PieceMovement";

export class Game {
  constructor() {
    this.squares = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        this.squares.push(new Square(String.fromCharCode(97 + i), j + 1));
      }
    }
  }
  getAllSquares() {
    return this.squares;
  }
  clearAllSquareAttackCount() {
    this.squares.forEach((sq) => (sq.attackCount = 0));
  }
  getSquare(file, rank) {
    return this.squares.find(
      (square) => square.file === file && square.rank === rank
    );
  }
  getAttackedSquares() {
    return this.squares.filter((square) => square.attackCount > 0);
  }
  calculateAllAttackedSquare() {
    this.clearAllSquareAttackCount();
    const squareWithPieces = this.squares.filter((square) => square.piece);
    squareWithPieces.forEach((square) => {
      switch (square.piece) {
        case "B": // bishop
          calculateAttackedSquares(square, this, BISHOP_DIRECTIONS);
          break;
        case "R": // rook
          calculateAttackedSquares(square, this, ROOK_DIRECTIONS);
          break;
        case "Q": // queen
          calculateAttackedSquares(square, this, QUEEN_DIRECTIONS);
          break;
        case "N": //knight
          knightAttackedSquare(square, this);
          break;
        case "K":
          kingAttackedSquare(square, this);
      }
    });
  }
  placePiece(file, rank, piece) {
    const square = this.getSquare(file, rank);
    square.setPiece(piece);
    this.calculateAllAttackedSquare();
  }
  removePiece(file, rank) {
    this.getSquare(file, rank).removePiece();
    this.calculateAllAttackedSquare();
  }
}
