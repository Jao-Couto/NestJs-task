import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UsersService } from '../users.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(private usersSerivce: UsersService) {}

  async validate(email: string): Promise<boolean> {
    const existsUserWithEmail = await this.usersSerivce.existsUserByEmail(
      email,
    );
    return !existsUserWithEmail;
  }
}

export const UniqueEmail = (validationOptions: ValidationOptions) => {
  return (object: any, property: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: property,
      options: validationOptions,
      constraints: [],
      validator: UniqueEmailValidator,
    });
  };
};
