import 'reflect-metadata';
import express from 'express';
import { Container, injectable, inject } from 'inversify';

// Define services as interfaces and classes
interface IUserService {
  getAllUsers(): { id: number; name: string; }[];
}

@injectable()
class UserService implements IUserService {
  getAllUsers() {
    // Return a list of users
    return [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }];
  }
}

// Define the controller
@injectable()
class UserController {
  private userService: IUserService;

  constructor(@inject('UserService') userService: IUserService) {
    this.userService = userService;
  }

  public getAllUsers(req: express.Request, res: express.Response) {
    const users = this.userService.getAllUsers();
    res.json(users);
  }
}

// Create the Inversify container
const container = new Container();

// Register services and dependencies
container.bind<IUserService>('UserService').to(UserService).inSingletonScope();
container.bind<UserController>(UserController).toSelf().inSingletonScope();

// Create the express app
const app = express();

// Define API routes using the controller methods
app.get('/users', (req, res) => {
  const userController = container.get<UserController>(UserController);
  userController.getAllUsers(req, res);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
