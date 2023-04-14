import { EmailsService } from '../emails/emails.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { ImagesService } from '../images/images.service';
import * as fs from 'fs';
import { User } from './schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { RabbitMqService } from '../rabbit-mq/rabbit-mq.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ImageDto } from './dto/image.dto';
jest.mock('fs');

describe('UsersService', () => {
  let userService: UsersService;
  let httpService: HttpService;
  let emailsService: EmailsService;
  let imagesService: ImagesService;
  let rabbitMqService: RabbitMqService;

  const mockRepositor = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  };

  class mockModel {
    constructor(public data?: any) {}

    save() {
      return { ...this.data };
    }

    static save() {
      return {
        id: 5,
        email: 'email@gmail.com',
        first_name: 'Joao',
        last_name: 'Vitor',
        avatar: 'https://reqres.in/img/faces/12-image.jpg',
        avatarName: '',
      };
    }

    static findOne(filter: any) {
      if (filter.id == 5)
        return {
          _id: 'itsamongooseid',
          id: 5,
          email: 'email@gmail.com',
          first_name: 'Joao',
          last_name: 'Vitor',
          avatar: 'https://reqres.in/img/faces/12-image.jpg',
          avatarName: 'b42e94e3-ab0d-4e88-9dbb-9777df1724af.jpeg',
          save: () => {
            return true;
          },
        };
      return null;
    }

    static count() {
      return 4;
    }

    static findByIdAndUpdate(_id: string, data: any) {
      return {
        _id: 'itsamongooseid',
        id: 5,
        email: 'email@gmail.com',
        first_name: 'Joao',
        last_name: 'Vitor',
        avatar: 'https://reqres.in/img/faces/12-image.jpg',
        avatarName: 'b42e94e3-ab0d-4e88-9dbb-9777df1724af.jpeg',
        ...data.$set,
      };
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        EmailsService,
        ImagesService,
        RabbitMqService,
        {
          provide: HttpService,
          useValue: {
            ...mockRepositor,
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: mockModel,
        },
        {
          provide: 'USER_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    httpService = module.get<HttpService>(HttpService);
    emailsService = module.get<EmailsService>(EmailsService);
    imagesService = module.get<ImagesService>(ImagesService);
    rabbitMqService = module.get<RabbitMqService>(RabbitMqService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(httpService).toBeDefined();
    expect(emailsService).toBeDefined();
    expect(imagesService).toBeDefined();
    expect(rabbitMqService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create user with success', async () => {
      //Arrange
      const user: CreateUserDto = {
        email: 'email@gmail.com',
        first_name: 'Joao',
        last_name: 'Vitor',
        avatar: 'https://reqres.in/img/faces/12-image.jpg',
      };
      const expectResult = {
        id: 5,
        email: 'email@gmail.com',
        first_name: 'Joao',
        last_name: 'Vitor',
        avatar: 'https://reqres.in/img/faces/12-image.jpg',
      };

      //Act
      mockRepositor.post.mockReturnValueOnce(
        of({
          data: true,
          headers: { 'Content-Type': 'application/json' },
          config: {},
          status: 202,
          statusText: 'Accepted',
        }),
      );
      const result = await userService.create(user);

      //Assert
      expect(result).toEqual(expectResult);
    });
  });

  describe('getUser', () => {
    it('should get user with success', async () => {
      //Arrange
      const expectResult = {
        id: '5',
        email: 'george.bluth@reqres.in',
        first_name: 'George',
        last_name: 'Bluth',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      };
      //Act

      mockRepositor.get.mockReturnValue(
        of({
          data: expectResult,
          headers: { 'Content-Type': 'application/json' },
          config: {},
          status: 200,
          statusText: 'OK',
        }),
      );
      const result = await userService.findOne(1);

      //Assert
      expect(result).toEqual(expectResult);
      expect(httpService.get).toBeCalledTimes(1);
    });
  });

  describe('getUserAvatar', () => {
    it('should get user avatar with success', async () => {
      //Arrange
      //Act
      const res = Buffer.from('a-base64-image').toString('base64');
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(res);
      //Act
      const expectResult: ImageDto = { image: res };
      const result = await userService.findOneAvatar(5);

      //Assert
      expect(result).toEqual(expectResult);
    });
  });

  describe('deleteUserAvatar', () => {
    it('should get user avatar with success', async () => {
      //Arrange
      (fs.unlinkSync as jest.Mock).mockReturnValueOnce(undefined);
      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
      //Act
      const result = await userService.remove(5);
      //Assert
      expect(result).toBeTruthy();
    });
  });
});
