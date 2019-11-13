export class UrlArgumentMissing extends Error {
  constructor(message) {
    super(message);
    this.name = 'UrlArgumentMissing';
  }
}
