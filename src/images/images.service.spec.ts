import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import { ImageDto } from './dto/image.dto';

jest.mock('fs');
jest.mock('uuid');

describe('ImagesService', () => {
  let imagesService: ImagesService;
  let httpService: HttpService;
  const mockRepositor = {
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
      const buffer = Buffer.from([1, 2, 3]);
      const url = 'https://example.com/avatar.jpg';
      const name = 'b42e94e3-ab0d-4e88-9dbb-9777df1724af';
      //Act

      mockRepositor.get.mockReturnValue(
        of({
          data: buffer,
          headers: {},
          config: {},
          status: 200,
          statusText: 'OK',
        }),
      );
      (uuid as jest.Mock).mockReturnValueOnce(name);
      (fs.writeFileSync as jest.Mock).mockReturnValueOnce(undefined);

      const result = await imagesService.saveFile(url);
      const resultExpected = new ImageDto(
        buffer.toString('base64'),
        name + '.jpeg',
      );
      //Assert
      expect(result).toEqual(resultExpected);
      expect(httpService.get).toBeCalledTimes(1);
    });
  });

  describe('getImage', () => {
    it('should get image with success', async () => {
      //Arrange
      const res = Buffer.from('a-base64-image').toString('base64');
      const name = 'b42e94e3-ab0d-4e88-9dbb-9777df1724af';
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(res);
      //Act
      const result = await imagesService.getFile(name);
      const resultExpected = new ImageDto(res);

      //Assert
      expect(result).toEqual(resultExpected);
    });
  });

  describe('deleteImage', () => {
    it('should delete image with success', async () => {
      //Arrange
      const name = 'b42e94e3-ab0d-4e88-9dbb-9777df1724af';
      (fs.unlinkSync as jest.Mock).mockReturnValueOnce(undefined);
      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

      //Act
      const result = imagesService.deleteFile(name);

      //Assert
      expect(result).toBeTruthy();
    });
  });
});
