import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import { lastValueFrom } from 'rxjs';
import { ImageDto } from './dto/image.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ImagesService {
  constructor(private httpService: HttpService) {}

  async getFile(imageName: string): Promise<ImageDto> {
    try {
      const img = fs.readFileSync(`./images/${imageName}`);
      return new ImageDto(img.toString('base64'));
    } catch (error) {
      return error;
    }
  }

  async saveFile(imageUrl: string): Promise<ImageDto> {
    try {
      const name = uuid() + '.jpeg';
      const img = await lastValueFrom(
        this.httpService.get(imageUrl, { responseType: 'arraybuffer' }),
      );
      const buffer = Buffer.from(img.data, 'base64');

      fs.writeFileSync('./images/' + name, buffer, { encoding: 'base64' });

      return new ImageDto(buffer.toString('base64'), name);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteFile(imageName: string): Promise<boolean> {
    try {
      const exists = fs.existsSync(`./images/${imageName}`);
      if (!exists) return false;
      fs.unlinkSync(`./images/${imageName}`);
      return true;
    } catch (error) {
      return false;
    }
  }
}
