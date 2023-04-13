import { HttpException, HttpStatus } from '@nestjs/common';
// success: true => message, data
// success: false => errorMessage, error

import { ResponseInterface } from '../interfaces/response.interface';

export class ResponseErrorDto implements ResponseInterface {
  constructor(infoMessage: string, status?: HttpStatus) {
    this.success = false;
    this.data = new HttpException(infoMessage, status);
  }
  message: string;
  data: HttpException;
  success: boolean;
}

export class ResponseSuccessDto implements ResponseInterface {
  constructor(infoMessage: string, data?: any) {
    this.success = true;
    this.message = infoMessage;
    this.data = data;
  }
  message: string;
  data: any[];
  success: boolean;
}
