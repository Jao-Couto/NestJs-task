
## .env.development with RabbitMQ and MongoDb Atlas URI
If my MongoDb URI not available, just insert your link

## Installation

```bash
$ npm install
```

## Docker with RabbitMQ
#### It needs docker installed

```bash
$ docker-compose up
```

## Running the app

```bash
$ npm run start
```

## Unit Test

```bash
$ npm run test
```
## Routes
### POST /api/users
#### Body
```
{
    "email": "teste@gmail.com",
    "first_name": "User",
    "last_name": "Test",
    "avatar": "https://reqres.in/img/faces/1-image.jpg"
}
```
### GET /api/user/{userId}

### GET /api/user/{userId}/avatar

### DELETE /api/user/{userId}/avatar

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
