export class UserEntity {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;

  constructor(user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  }) {
    this.id = user.id;
    this.email = user.email;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.avatar = user.avatar;
  }
}
