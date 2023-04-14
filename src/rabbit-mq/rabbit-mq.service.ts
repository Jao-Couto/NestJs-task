import { Injectable, Inject } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMqService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async sendMessage(message: any) {
    this.client.emit<any>('user_created', message);
  }
}
