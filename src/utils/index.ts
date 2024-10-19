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
