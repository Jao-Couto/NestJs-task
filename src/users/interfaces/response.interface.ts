// success: true => message, data
// success: false => errorMessage, error

export interface ResponseInterface {
  success: boolean;
  message: string;
  data: any;
}
