import { IncomingMessage, ServerResponse } from 'http';
import {
  handleGetUsers,
  handleGetUserById,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} from '../controllers/userController';
import {
  parseBody,
  putUsersInMaster,
  removeUsersInMaster,
  requestUsersFromMaster,
  sendResponse,
  updateUsersInMaster,
} from '../utils';
import cluster from 'cluster';
import { getUsers } from '../db';
import { User } from '../models/userModel';

const isWorker = cluster.isWorker && process.send;

export const userRoutes = async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;

  if (!url) {
    sendResponse(res, 404, { message: 'Not found' });
    return;
  }

  const userId = url.split('/')[3];

  switch (method) {
    case 'GET':
      if (url === '/api/users') {
        if (isWorker) {
          const users = (await requestUsersFromMaster(req, res)) as User[];
          return handleGetUsers(req, res, users);
        } else {
          return handleGetUsers(req, res, getUsers());
        }
      } else if (url.startsWith('/api/users/') && userId) {
        if (isWorker) {
          const users = (await requestUsersFromMaster(req, res)) as User[];
          return handleGetUserById(req, res, users, userId);
        } else {
          return handleGetUserById(req, res, getUsers(), userId);
        }
      } else {
        sendResponse(res, 404, { message: 'Not found' });
      }
      break;

    case 'POST':
      if (url === '/api/users') {
        try {
          const body = await parseBody(req);
          const newUser = await handleCreateUser(req, res, body);

          if (cluster.isWorker) {
            updateUsersInMaster(getUsers());
          }

          return newUser;
        } catch (err) {
          sendResponse(res, 400, { message: 'Invalid JSON' });
        }
      } else {
        sendResponse(res, 404, { message: 'Not found' });
      }
      break;

    case 'PUT':
      if (url.startsWith('/api/users/') && userId) {
        try {
          const body = await parseBody(req);
          if (isWorker) {
            const users = (await requestUsersFromMaster(req, res)) as User[];
            const updatedUser = handleUpdateUser(req, res, users, userId, body);
            putUsersInMaster(users);
            return updatedUser;
          } else {
            return handleUpdateUser(req, res, getUsers(), userId, body);
          }
        } catch (err) {
          sendResponse(res, 400, { message: 'Invalid JSON' });
        }
      } else {
        sendResponse(res, 404, { message: 'Not found' });
      }
      break;

    case 'DELETE':
      if (url.startsWith('/api/users/') && userId) {
        if (isWorker) {
          const users = (await requestUsersFromMaster(req, res)) as User[];
          const removedUser = handleDeleteUser(req, res, users, userId);
          removeUsersInMaster(users);
          return removedUser;
        } else {
          return handleDeleteUser(req, res, getUsers(), userId);
        }
      } else {
        sendResponse(res, 404, { message: 'Not found' });
      }
      break;

    default:
      sendResponse(res, 404, { message: 'Not found' });
      break;
  }
};
