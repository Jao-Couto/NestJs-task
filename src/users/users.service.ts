import { RabbitMqService } from './../rabbit-mq/rabbit-mq.service';
import { ImagesService } from './../images/images.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { EmailsService } from '../emails/emails.service';
import { ImageDto } from './dto/image.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private httpService: HttpService,
    private emailsService: EmailsService,
    private imagesService: ImagesService,
    private rabbitMqService: RabbitMqService,
  ) {}

  private url = 'https://reqres.in/api/users';

  async create(createUserDto: CreateUserDto): Promise<User> {
    const id = (await this.countUsers()) + 1;
    //Create User
    const createdUser = new this.userModel({ id, ...createUserDto });
    const response = await createdUser.save();

    //Send Email
    await this.emailsService.sendMail({
      email: createUserDto.email,
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
    });

    //Send RabbitMq Event
    await this.rabbitMqService.sendMessage({ userId: createdUser.id });

    return response;
  }

  async existsUserByEmail(email: string): Promise<boolean> {
    return (await this.userModel.findOne({ email })) !== null;
  }

  async countUsers(): Promise<number> {
    return await this.userModel.count();
  }

  async findOne(id: number): Promise<User> {
    const response = await lastValueFrom(
      this.httpService.get(this.url + '/' + id),
    );
    if (response.data.data != undefined) return response.data.data;
    return response.data;
  }

  async findOneAvatar(id: number): Promise<ImageDto> {
    const user: User = await this.userModel.findOne({ id });
    if (user.avatarName) {
      const res = await this.imagesService.getFile(user.avatarName);
      if (res.image) return { image: res.image };
    }

    const image = await this.imagesService.saveFile(user.avatar);
    await this.userModel.findByIdAndUpdate(user._id, {
      $set: { avatarName: image.name },
    });
    return { image: image.image };
  }

  async remove(id: number): Promise<boolean> {
    const user: User = await this.userModel.findOne({ id });
    if (
      !user.avatarName ||
      !(await this.imagesService.deleteFile(user.avatarName))
    )
      return false;
    user.avatarName = '';
    await user.save();
    return true;
  }
}
