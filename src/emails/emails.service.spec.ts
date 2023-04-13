import { Test, TestingModule } from '@nestjs/testing';
import { EmailsService } from './emails.service';
import { HttpService } from '@nestjs/axios';
import { UserInfo } from 'src/images/dto/user-info.dto';
import { of } from 'rxjs';

describe('EmailsService', () => {
  let emailsService: EmailsService;
  let httpService: HttpService;
  const mockRepositor = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailsService,
        {
          provide: HttpService,
          useValue: {
            ...mockRepositor,
          },
        },
      ],
    }).compile();

    emailsService = module.get<EmailsService>(EmailsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(emailsService).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should send email with success', async () => {
      //Arrange
      const user: UserInfo = {
        email: 'teste@gmail.com',
        first_name: 'Email',
        last_name: 'Teste',
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
      const result = await emailsService.sendMail(user);

      //Assert
      expect(result).toBeTruthy();
      expect(httpService.post).toBeCalledTimes(1);
    });
  });
});
