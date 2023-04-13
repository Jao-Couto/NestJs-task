import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ResponseErrorDto, ResponseSuccessDto } from './dto/response.dto';
import { ListUsuerDTO } from './dto/list-user.dto';
import { ResponseInterface } from './interfaces/response.interface';

@Controller('api')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject('HELLO_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post('users')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseInterface> {
    try {
      this.client.emit<any>('create_user', createUserDto);
      await this.usersService.create(createUserDto);
      return new ResponseSuccessDto('User created');
    } catch (error) {
      return new ResponseErrorDto('User not created', HttpStatus.FORBIDDEN);
    }
  }

  @Get('user/:id')
  async findOne(@Param('id') id: string): Promise<ResponseInterface> {
    try {
      this.client.emit<any>('find_user', id);
      const user = new ListUsuerDTO(await this.usersService.findOne(id));
      return new ResponseSuccessDto('User found', user);
    } catch (error) {
      return new ResponseErrorDto('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('user/:id/avatar')
  async findOneAvatar(@Param('id') id: string): Promise<ResponseInterface> {
    try {
      this.client.emit<any>('find_avatar', id);
      const image = await this.usersService.findOneAvatar(id);
      return new ResponseSuccessDto('Avatar found', image);
    } catch (error) {
      return new ResponseErrorDto('Avatar not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete('user/:id/avatar')
  async remove(@Param('id') id: string): Promise<ResponseInterface> {
    try {
      this.client.emit<any>('dele_avatar', id);
      if (!(await this.usersService.remove(id))) throw new Error('not_found');
      return new ResponseSuccessDto('Image deleted');
    } catch (error) {
      return new ResponseErrorDto('Image not found', HttpStatus.NOT_FOUND);
    }
  }
}
