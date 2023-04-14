import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMqService } from './rabbit-mq.service';

describe('RabbitMqService', () => {
  let rabbitMqService: RabbitMqService;
  const mockRepositor = {
    emit: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMqService,
        {
          provide: 'USER_SERVICE',
          useValue: {
            ...mockRepositor,
          },
        },
      ],
    }).compile();

    rabbitMqService = module.get<RabbitMqService>(RabbitMqService);
  });

  it('should be defined', () => {
    expect(rabbitMqService).toBeDefined();
  });

  describe('sendRabbitMessage', () => {
    it('should send a rabbit messsage with success', async () => {
      //Arrange
      const message = { userId: 1 };
      //Act
      await rabbitMqService.sendMessage(message);
      //Assert
      expect(mockRepositor.emit).toHaveBeenCalledWith('user_created', message);
    });
  });
});
