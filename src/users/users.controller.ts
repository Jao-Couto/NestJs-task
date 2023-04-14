import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseErrorDto, ResponseSuccessDto } from './dto/response.dto';
import { ListUsuerDTO } from './dto/list-user.dto';
import { ResponseInterface } from './interfaces/response.interface';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseInterface> {
    try {
      const userCreated = await this.usersService.create(createUserDto);
      return new ResponseSuccessDto('User created', userCreated);
    } catch (error) {
      return new ResponseErrorDto('User not created', HttpStatus.FORBIDDEN);
    }
  }

  @Get('user/:id')
  async findOne(@Param('id') id: number): Promise<ResponseInterface> {
    try {
      const user = new ListUsuerDTO(await this.usersService.findOne(id));
      return new ResponseSuccessDto('User found', user);
    } catch (error) {
      return new ResponseErrorDto('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('user/:id/avatar')
  async findOneAvatar(@Param('id') id: number): Promise<ResponseInterface> {
    try {
      const image = await this.usersService.findOneAvatar(id);
      return new ResponseSuccessDto('Avatar found', image);
    } catch (error) {
      return new ResponseErrorDto('Avatar not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete('user/:id/avatar')
  async remove(@Param('id') id: number): Promise<ResponseInterface> {
    try {
      if (!(await this.usersService.remove(id))) throw new Error('not_found');
      return new ResponseSuccessDto('Image deleted');
    } catch (error) {
      return new ResponseErrorDto('Image not found', HttpStatus.NOT_FOUND);
    }
  }
}
