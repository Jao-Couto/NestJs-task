import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { HttpService } from '@nestjs/axios';
import { of, lastValueFrom } from 'rxjs';
import * as fs from 'fs';

describe('ImagesService', () => {
  let imagesService: ImagesService;
  let httpService: HttpService;
  const mockRepositor = {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: HttpService,
          useValue: {
            ...mockRepositor,
          },
        },
      ],
    }).compile();

    imagesService = module.get<ImagesService>(ImagesService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(imagesService).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('saveImage', () => {
    it('should save image with success', async () => {
      //Arrange
      const user = {
        id: '10',
        avatar: 'https://reqres.in/img/faces/10-image.jpg',
      };
      const img = fs.readFileSync('src/images/imageTest/10.jpeg');
      const postResponse = {
        userId: '10',
        path: './images/10.jpeg',
      };
      //Act

      mockRepositor.get.mockReturnValue(
        of({
          data: img,
          headers: {},
          config: {},
          status: 200,
          statusText: 'OK',
        }),
      );

      mockRepositor.post.mockReturnValue(
        of({
          data: postResponse,
          headers: {},
          config: {},
          status: 200,
          statusText: 'OK',
        }),
      );
      const result = imagesService.saveFile(user.avatar, user.id);
      //Assert
      expect(result).toBeTruthy();
      expect(httpService.get).toBeCalledTimes(1);
    });
  });

  describe('getImage', () => {
    it('should get image with success', async () => {
      //Arrange
      const user = {
        id: '10',
        avatar: 'https://reqres.in/img/faces/10-image.jpg',
      };
      //Act
      const result = await imagesService.getFile(user.id, user.avatar);

      //Assert
      expect(result).toBeTruthy();
    });
  });

  describe('deleteImage', () => {
    it('should delete image with success', async () => {
      //Arrange
      //Act
      mockRepositor.delete.mockReturnValue(
        of({
          data: true,
          headers: {},
          config: {},
          status: 204,
          statusText: 'No Content',
        }),
      );
      const result = imagesService.deleteFile('10');
      //Assert
      expect(result).toBeTruthy();
      expect(httpService.delete).toBeCalledTimes(1);
    });
  });
});
