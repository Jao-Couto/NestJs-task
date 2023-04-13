import { EmailsService } from '../emails/emails.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { ImagesService } from '../images/images.service';
import { UserEntity } from './entities/user.entity';
import * as fs from 'fs';
import { ImageDto } from './dto/image.dto';

describe('UsersService', () => {
  let userService: UsersService;
  let httpService: HttpService;
  let emailsService: EmailsService;
  let imagesService: ImagesService;

  const mockRepositor = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        EmailsService,
        ImagesService,
        {
          provide: HttpService,
          useValue: {
            ...mockRepositor,
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    httpService = module.get<HttpService>(HttpService);
    emailsService = module.get<EmailsService>(EmailsService);
    imagesService = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(httpService).toBeDefined();
    expect(emailsService).toBeDefined();
    expect(imagesService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create user with success', async () => {
      //Arrange
      const user = {
        email: 'email@gmail.com',
        first_name: 'Joao',
        last_name: 'Vitor',
        avatar: 'https://reqres.in/img/faces/12-image.jpg',
      };
      mockRepositor.post
        .mockReturnValueOnce(
          of({
            data: true,
            headers: { 'Content-Type': 'application/json' },
            config: {},
            status: 201,
            statusText: 'Created',
          }),
        )
        .mockReturnValueOnce(
          of({
            data: true,
            headers: { 'Content-Type': 'application/json' },
            config: {},
            status: 202,
            statusText: 'Accepted',
          }),
        );
      //Act
      const result = await userService.create(user);
      //Assert
      expect(result).toBeTruthy();
      expect(httpService.post).toBeCalledTimes(2);
    });
  });

  describe('getUser', () => {
    it('should get user with success', async () => {
      //Arrange
      const data = {
        id: '1',
        email: 'george.bluth@reqres.in',
        first_name: 'George',
        last_name: 'Bluth',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      };
      const expectResult: UserEntity = new UserEntity(data);
      //Act

      mockRepositor.get.mockReturnValue(
        of({
          data,
          headers: { 'Content-Type': 'application/json' },
          config: {},
          status: 200,
          statusText: 'OK',
        }),
      );
      const result = await userService.findOne('1');

      //Assert
      expect(result).toEqual(expectResult);
      expect(httpService.get).toBeCalledTimes(1);
    });
  });

  describe('getUserAvatar', () => {
    it('should get user avatar with success', async () => {
      //Arrange
      const img = fs.readFileSync('src/images/imageTest/12.jpeg');
      const userResponse = {
        id: '12',
        email: 'george.bluth@reqres.in',
        first_name: 'George',
        last_name: 'Bluth',
        avatar: 'https://reqres.in/img/faces/12-image.jpg',
      };
      const postResponse = {
        userId: '12',
        path: './images/12.jpeg',
      };
      const expectResult: ImageDto = new ImageDto(img.toString('base64'));
      //Act
      mockRepositor.get
        .mockReturnValueOnce(
          of({
            data: userResponse,
            headers: { 'Content-Type': 'application/json' },
            config: {},
            status: 200,
            statusText: 'OK',
          }),
        )
        .mockReturnValueOnce(
          of({
            data: img,
            headers: { 'Content-Type': 'application/json' },
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

      const result = await userService.findOneAvatar('12');

      //Assert
      expect(result).toEqual(expectResult);
    });
  });

  describe('deleteUserAvatar', () => {
    it('should get user avatar with success', async () => {
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
      const result = await userService.remove('12');
      //Assert
      expect(result).toBeTruthy();
      expect(httpService.delete).toBeCalledTimes(1);
    });
  });
});
