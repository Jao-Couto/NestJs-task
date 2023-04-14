export class ImageDto {
  readonly image: string;
  readonly name: string;

  constructor(image: string, name = '') {
    this.image = image;
    this.name = name;
  }
}
