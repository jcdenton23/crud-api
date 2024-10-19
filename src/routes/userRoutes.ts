import { IncomingMessage, ServerResponse } from 'http';
import {
  handleGetUsers,
  handleGetUserById,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} from '../controllers/userController';
import { parseBody, sendResponse } from '../utils';


export const userRoutes = async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;

  if (!url) {
    sendResponse(res, 400, { message: 'URL is required' });
    return;
  }

  const userId = url.split('/')[3];

  switch (method) {
    case 'GET':
      if (url === '/api/users') {
        return handleGetUsers(req, res);
      } else if (url.startsWith('/api/users/') && userId) {
        return handleGetUserById(req, res, userId);
      } else {
        sendResponse(res, 400, { message: 'User ID is required' });
      }
      break;

    case 'POST':
      if (url === '/api/users') {
        try {
          const body = await parseBody(req);
          return handleCreateUser(req, res, body);
        } catch (err) {
          sendResponse(res, 400, { message: 'Invalid JSON' });
        }
      }
      break;

    case 'PUT':
      if (url.startsWith('/api/users/') && userId) {
        try {
          const body = await parseBody(req);
          return handleUpdateUser(req, res, userId, body);
        } catch (err) {
          sendResponse(res, 400, { message: 'Invalid JSON' });
        }
      } else {
        sendResponse(res, 400, { message: 'User ID is required' });
      }
      break;

    case 'DELETE':
      if (url.startsWith('/api/users/') && userId) {
        return handleDeleteUser(req, res, userId);
      } else {
        sendResponse(res, 400, { message: 'User ID is required' });
      }
      break;

    default:
      sendResponse(res, 404, { message: 'Not found' });
      break;
  }
};
