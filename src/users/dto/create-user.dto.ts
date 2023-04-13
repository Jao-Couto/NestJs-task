import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail(undefined, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty({ message: 'first_name cannot be empty' })
  first_name: string;

  @IsNotEmpty({ message: 'last_name cannot be empty' })
  last_name: string;

  @IsNotEmpty({ message: 'avatar cannot be empty' })
  avatar: string;
}
