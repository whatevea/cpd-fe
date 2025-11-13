import { Game } from "@/app/lib/chesszero/Game";
export function randomPiecePlacer(piecesCount) {
  const pieces = ["B", "R", "Q", "N", "K"];
  const squares = {};

  for (let i = 0; i < piecesCount; i++) {
    let file = String.fromCharCode(97 + Math.floor(Math.random() * 8)); // a-h
    let rank = Math.floor(Math.random() * 8) + 1; // 1-8
    let square = `${file}${rank}`;

    // Ensure no piece is placed on an already occupied square
    while (squares[square]) {
      file = String.fromCharCode(97 + Math.floor(Math.random() * 8));
      rank = Math.floor(Math.random() * 8) + 1;
      square = `${file}${rank}`;
    }

    squares[square] = pieces[Math.floor(Math.random() * pieces.length)];
  }

  return squares;
}

export function targetSquares(difficulty) {
  const targetPieces = randomPiecePlacer(difficulty);
  const targetGame = new Game();
  Object.entries(targetPieces).forEach(([position, piece]) => {
    const [file, rank] = [position[0], parseInt(position[1])];
    targetGame.placePiece(file, rank, piece);
  });

  const attackedSquares = targetGame.getAttackedSquares().reduce(
    (acc, square) => ({
      ...acc,
      [`${square.file}${square.rank}`]: square.attackCount,
    }),
    {}
  );
  return { attackedSquares: attackedSquares, solution: targetPieces };
}
