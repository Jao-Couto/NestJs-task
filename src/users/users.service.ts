import { ImagesService } from './../images/images.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { EmailsService } from 'src/emails/emails.service';
import { UserEntity } from './entities/user.entity';
import { ImageDto } from './dto/image.dto';

@Injectable()
export class UsersService {
  constructor(
    private httpService: HttpService,
    private emailsService: EmailsService,
    private imagesService: ImagesService,
  ) {}

  private url = 'https://reqres.in/api/users';

  async create(createUserDto: CreateUserDto): Promise<boolean> {
    const response = await lastValueFrom(
      this.httpService.post(this.url, createUserDto),
    );
    if (response.status === 201) {
      return await this.emailsService.sendMail(response.data);
    }
    return response.status === 201;
  }

  async findOne(id: string): Promise<UserEntity> {
    const response = await lastValueFrom(
      this.httpService.get(this.url + '/' + id),
    );
    if (response.data.data != undefined)
      return new UserEntity(response.data.data);
    return new UserEntity(response.data);
  }

  async findOneAvatar(id: string): Promise<ImageDto> {
    const response = await lastValueFrom(
      this.httpService.get(this.url + '/' + id),
    );
    let user: UserEntity;
    if (response.data.data != undefined) user = response.data.data;
    else user = response.data;
    const image = await this.imagesService.getFile(user.id, user.avatar);
    return image;
  }

  async remove(id: string): Promise<boolean> {
    const fileDeleted = this.imagesService.deleteFile(id);
    return fileDeleted;
  }
}
