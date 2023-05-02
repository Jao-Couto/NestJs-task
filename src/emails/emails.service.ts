import { Injectable } from '@nestjs/common';
import { SendEmailInterface } from './interface/send-email.interface';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { UserInfo } from './dto/user-info.dto';

@Injectable()
export class EmailsService {
  constructor(private httpService: HttpService) {}
  private config = {
    headers: {
      Authorization:
        'Bearer TOKEN',
    },
  };

  async sendMail(user: UserInfo): Promise<boolean> {
    const data: SendEmailInterface = {
      personalizations: [
        {
          to: [
            {
              name: `${user.first_name} ${user.last_name}`,
              email: user.email,
            },
          ],
        },
      ],
      from: {
        email: 'joao.couto1228@gmail.com',
        name: 'Joao',
      },
      reply_to: {
        email: 'joao.couto1228@gmail.com',
        name: 'Joao',
      },
      subject: 'Email test',
      content: [
        {
          type: 'text/html',
          value: '<p>Email Test</p>',
        },
      ],
    };

    const response = await lastValueFrom(
      this.httpService.post(
        'https://api.sendgrid.com/v3/mail/send',
        data,
        this.config,
      ),
    );

    return response.status === 202;
  }
}
