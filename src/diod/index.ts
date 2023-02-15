import 'reflect-metadata';
import { ContainerBuilder, Service } from 'diod';
import express, { Router } from 'express';

export class UserService {

  private users: string[] = ['juan', 'cata', 'ines'];

  getUsers(): string[] {
    return this.users;
  }

}

@Service()
export class UserController {
  constructor(private userService: UserService) { }

  getUsers(req, res): void {
    const users = this.userService.getUsers();
    res.send(users);
  }

}

const container = new ContainerBuilder();

container.registerAndUse(UserService);
container.registerAndUse(UserController);

const router = Router();
const builder = container.build();

const userController = builder.get(UserController);

router.get('/users', (req, res) => {
  userController.getUsers(req, res);
});

const app = express();

app.use('/api', router);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});