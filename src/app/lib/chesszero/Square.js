export const filearr = ["a", "b", "c", "d", "e", "f", "g", "h"];
export class Square {
  constructor(file, rank) {
    this.file = file;
    this.rank = rank;
    this.attackCount = 0;
    this.piece = null;
  }
  static decreaseFile(file) {
    const index = filearr.indexOf(file);
    if (index <= 0) return null;
    return filearr[index - 1];
  }
  static increaseFile(file) {
    const index = filearr.indexOf(file);
    if (index >= 7) return null;
    return filearr[index + 1];
  }
  static changeFile(file, change) {
    const newFileCode = file.charCodeAt(0) + change;
    if (newFileCode >= 97 && newFileCode <= 104) {
      return String.fromCharCode(newFileCode);
    }
    return null;
  }
  toString() {
    return this.file + this.rank.toString();
  }
  setAttackCount(count) {
    this.attackCount = count;
  }
  increaseAttackCount() {
    this.attackCount++;
  }
  setPiece(piece) {
    this.piece = piece;
  }
  removePiece() {
    this.piece = null;
  }
}
