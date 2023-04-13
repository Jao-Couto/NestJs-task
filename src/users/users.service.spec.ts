import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
jest.mock('fs');

describe('UsersService', () => {
  let userService: UsersService;
  let httpService: HttpService;
  const mockRepositor = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(httpService).toBeDefined();
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
      mockRepositor.post.mockReturnValue(
        of({
          data: true,
          headers: { 'Content-Type': 'application/json' },
          config: {},
          status: 201,
          statusText: 'Created',
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
      //Act
      const result = await userService.findOne(1);
      mockRepositor.get.mockReturnValue(
        of({
          data: {
            id: 1,
            email: 'george.bluth@reqres.in',
            first_name: 'George',
            last_name: 'Bluth',
            avatar: 'https://reqres.in/img/faces/1-image.jpg',
          },
          headers: { 'Content-Type': 'application/json' },
          config: {},
          status: 200,
          statusText: 'OK',
        }),
      );
      //Assert
      expect(result).toBeTruthy();
      expect(httpService.get).toBeCalledTimes(1);
    });
  });

  describe('deleteUserAvatar', () => {
    it('should get user avatar with success', async () => {
      //Arrange
      //Act
      const result = await userService.remove(1);
      mockRepositor.delete.mockReturnValue(
        of({
          data: true,
          headers: {},
          config: {},
          status: 200,
          statusText: 'OK',
        }),
      );
      //Assert
      expect(result).toBeTruthy();
      expect(httpService.delete).toBeCalledTimes(1);
    });
  });

  // describe('getUserAvatar', () => {
  //     it('should get user avatar with success', async () => {
  //         //Arrange
  //         //Act
  //         const result = await userService.findOneAvatar(2)
  //         mockRepositor.get.mockReturnValue(of({
  //             data: true,
  //             headers: { 'Content-Type': 'application/json', },
  //             config: {},
  //             status: 200,
  //             statusText: 'OK',
  //         }))
  //         //Assert
  //         expect(result).toBeTruthy();
  //         expect(httpService.get).toBeCalledTimes(5);
  //     })
  // })
});
