import 'reflect-metadata';
import express from 'express';
import { injectable, singleton, container } from 'tsyringe';

@injectable()
class UserService {
  public getUsers(): string[] {
    return ['Alice', 'Bob', 'Charlie'];
  }
}

@injectable()
class UserController {
  constructor(private userService: UserService) { }

  public listUsers(req: express.Request, res: express.Response): void {
    const users = this.userService.getUsers();
    res.json(users);
  }
}

const app = express();

// Register our classes with the container
container.register<UserService>(UserService, { useClass: UserService });
container.register<UserController>(UserController, { useClass: UserController });

// Create an instance of UserController and inject its dependencies
const userController = container.resolve(UserController);

// Define a route for our API
app.get('/users', userController.listUsers.bind(userController));

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
