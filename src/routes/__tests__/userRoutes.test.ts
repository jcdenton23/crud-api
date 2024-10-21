import { IncomingMessage, ServerResponse } from 'http';
import { userRoutes } from '../userRoutes';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../../db';
import { parseBody, validateUUID } from '../../utils';
import { MESSAGES } from '../../controllers/userController';

jest.mock('../../db');
jest.mock('../../utils');

describe('User Routes', () => {
  let req: Partial<IncomingMessage>;
  let res: Partial<ServerResponse>;
  let endMock: jest.Mock;
  let writeHeadMock: jest.Mock;

  beforeEach(() => {
    endMock = jest.fn();
    writeHeadMock = jest.fn();

    req = {
      method: '',
      url: '',
    };

    res = {
      writeHead: writeHeadMock,
      end: endMock,
    } as Partial<ServerResponse>;
  });

  test('should return all users for GET /api/users', async () => {
    req.method = 'GET';
    req.url = '/api/users';

    const users = [
      { id: '1', username: 'user1' },
      { id: '2', username: 'user2' },
    ];
    (getUsers as jest.Mock).mockReturnValue(users);

    await userRoutes(req as IncomingMessage, res as ServerResponse);

    expect(writeHeadMock).toHaveBeenCalledWith(200, {
      'Content-Type': 'application/json',
    });
    expect(endMock).toHaveBeenCalledWith(JSON.stringify(users));
  });

  test('should return a user by ID for GET /api/users/:id', async () => {
    req.method = 'GET';
    req.url = '/api/users/1';

    (validateUUID as jest.Mock).mockReturnValue(true);

    const user = { id: '1', username: 'user1', age: 25, hobbies: ['reading'] };
    (getUserById as jest.Mock).mockReturnValue(user);

    await userRoutes(req as IncomingMessage, res as ServerResponse);

    expect(writeHeadMock).toHaveBeenCalledWith(200, {
      'Content-Type': 'application/json',
    });
    expect(endMock).toHaveBeenCalledWith(JSON.stringify(user));
  });

  test('should return 400 for invalid user ID in GET /api/users/:id', async () => {
    req.method = 'GET';
    req.url = '/api/users/invalid-id';

    (validateUUID as jest.Mock).mockReturnValue(false);

    await userRoutes(req as IncomingMessage, res as ServerResponse);

    expect(writeHeadMock).toHaveBeenCalledWith(400, {
      'Content-Type': 'application/json',
    });
    expect(endMock).toHaveBeenCalledWith(
      JSON.stringify({ message: 'Invalid user ID' })
    );
  });

  test('should create a new user for POST /api/users', async () => {
    req.method = 'POST';
    req.url = '/api/users';
    const body = { username: 'user1', age: 25, hobbies: ['reading'] };
    (parseBody as jest.Mock).mockResolvedValue(body);
    (createUser as jest.Mock).mockReturnValue({ id: '1', ...body });

    await userRoutes(req as IncomingMessage, res as ServerResponse);

    expect(writeHeadMock).toHaveBeenCalledWith(201, {
      'Content-Type': 'application/json',
    });
    expect(endMock).toHaveBeenCalledWith(
      JSON.stringify({
        message: 'User created successfully',
        user: { id: '1', ...body },
      })
    );
  });

  test('should return 400 for invalid input in POST /api/users', async () => {
    req.method = 'POST';
    req.url = '/api/users';
    const body = { username: '', age: 'twenty', hobbies: 'reading' };
    (parseBody as jest.Mock).mockResolvedValue(body);

    await userRoutes(req as IncomingMessage, res as ServerResponse);

    expect(writeHeadMock).toHaveBeenCalledWith(400, {
      'Content-Type': 'application/json',
    });
    expect(endMock).toHaveBeenCalledWith(
      JSON.stringify({ message: MESSAGES.REQUIRED_INPUT })
    );
  });

  test('should update a user for PUT /api/users/:id', async () => {
    req.method = 'PUT';
    req.url = '/api/users/1';
    (validateUUID as jest.Mock).mockReturnValue(true);
    const body = { username: 'user1', age: 26, hobbies: ['sports'] };
    (parseBody as jest.Mock).mockResolvedValue(body);
    (updateUser as jest.Mock).mockReturnValue({ id: '1', ...body });

    await userRoutes(req as IncomingMessage, res as ServerResponse);

    expect(writeHeadMock).toHaveBeenCalledWith(200, {
      'Content-Type': 'application/json',
    });
    expect(endMock).toHaveBeenCalledWith(JSON.stringify({ id: '1', ...body }));
  });

  test('should delete a user for DELETE /api/users/:id', async () => {
    req.method = 'DELETE';
    req.url = '/api/users/1';
    (deleteUser as jest.Mock).mockReturnValue(true);

    await userRoutes(req as IncomingMessage, res as ServerResponse);

    expect(writeHeadMock).toHaveBeenCalledWith(204);
  });

  test('should return 404 for non-existing user in DELETE /api/users/:id', async () => {
    req.method = 'DELETE';
    req.url = '/api/users/1';
    (deleteUser as jest.Mock).mockReturnValue(false);

    await userRoutes(req as IncomingMessage, res as ServerResponse);

    expect(writeHeadMock).toHaveBeenCalledWith(404, {
      'Content-Type': 'application/json',
    });
    expect(endMock).toHaveBeenCalledWith(
      JSON.stringify({ message: 'User not found' })
    );
  });
});
