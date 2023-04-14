import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UniqueEmail } from '../validate/unique-email.validator';

export class CreateUserDto {
  @IsEmail(undefined, { message: 'Invalid email' })
  @UniqueEmail({ message: 'Exists user with this email' })
  email: string;

  @IsNotEmpty({ message: 'first_name cannot be empty' })
  @IsString()
  first_name: string;

  @IsNotEmpty({ message: 'last_name cannot be empty' })
  @IsString()
  last_name: string;

  @IsNotEmpty({ message: 'avatar cannot be empty' })
  @IsString()
  avatar: string;
}
