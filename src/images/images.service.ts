import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import { lastValueFrom } from 'rxjs';
import { ImageDto } from './dto/image.dto';

@Injectable()
export class ImagesService {
  private url = 'https://reqres.in/api/users';

  constructor(private httpService: HttpService) {}

  async getFile(userID: string, imageUrl: string): Promise<ImageDto> {
    try {
      const img = fs.readFileSync(`./images/${userID}.jpeg`);
      return new ImageDto(img.toString('base64'));
    } catch {
      return await this.saveFile(imageUrl, userID);
    }
  }

  async saveFile(imageUrl: string, userId: string): Promise<ImageDto> {
    try {
      const name = './images/' + userId + '.jpeg';

      const img = await lastValueFrom(
        this.httpService.get(imageUrl, { responseType: 'arraybuffer' }),
      );
      const buffer = Buffer.from(img.data, 'base64');

      fs.writeFileSync(name, buffer, { encoding: 'base64' });

      await lastValueFrom(
        this.httpService.post(this.url + '/images', { userId, path: name }),
      );

      return new ImageDto(buffer.toString('base64'));
    } catch (error) {
      return;
    }
  }

  async deleteFile(userId: string): Promise<boolean> {
    try {
      const exists = fs.existsSync(`./images/${userId}.jpeg`);
      if (!exists) return false;

      fs.unlinkSync(`./images/${userId}.jpeg`);
      const response = await lastValueFrom(
        this.httpService.delete(this.url + '/' + userId),
      );
      return response.status === 204;
    } catch (error) {
      return false;
    }
  }
}
