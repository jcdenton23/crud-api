import cluster from 'cluster';
import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';

export const parseBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
};

export const sendResponse = (
  res: ServerResponse,
  statusCode: number,
  message: any
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(message));
};

export const validateUUID = (id: string): boolean => {
  return uuidValidate(id);
};

export const requestUsersFromMaster = (
  req: IncomingMessage,
  res: ServerResponse
) => {
  return new Promise((resolve, reject) => {
    if (process.send) {
      process.send({ type: 'requestUsers' });
      process.once('message', (msg: any) => {
        if (msg.type === 'provideUsers') {
          resolve(msg.data);
          reject(new Error('Failed to fetch users'));
        }
      });
    }
  });
};

export const updateUsersInMaster = (updatedUsers: any) => {
  if (cluster.isWorker && process.send) {
    process.send({ type: 'updateUsers', data: updatedUsers });
  }
};

export const removeUsersInMaster = (updatedUsers: any) => {
  if (cluster.isWorker && process.send) {
    process.send({ type: 'removeUsers', data: updatedUsers });
  }
};

export const putUsersInMaster = (updatedUsers: any) => {
  if (cluster.isWorker && process.send) {
    process.send({ type: 'putUsers', data: updatedUsers });
  }
};
