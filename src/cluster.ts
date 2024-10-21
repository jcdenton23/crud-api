import cluster from 'cluster';
import { cpus } from 'os';
import http from 'http';
import { userRoutes } from './routes/userRoutes';
import { User } from './models/userModel';

const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const totalCPUs = cpus().length;
const WORKER_COUNT = totalCPUs - 1;

let users: User[] = [];

const createLoadBalancerServer = (port: number) => {
  let currentWorkerIndex = 0;

  const loadBalancerServer = http.createServer((req, res) => {
    const assignedWorkerPort = port + (currentWorkerIndex % WORKER_COUNT) + 1;

    const proxyOptions = {
      hostname: 'localhost',
      port: assignedWorkerPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyRequest = http.request(proxyOptions, (workerRes) => {
      res.writeHead(workerRes.statusCode || 500, workerRes.headers);
      workerRes.pipe(res, { end: true });
    });

    proxyRequest.on('error', (err) => {
      console.error(`Proxy request error: ${err.message}`);
      res.writeHead(502);
      res.end('Bad Gateway');
    });

    req.pipe(proxyRequest, { end: true });
    currentWorkerIndex++;
  });

  return loadBalancerServer;
};

const startWorkerServer = (port: number) => {
  const server = http.createServer(userRoutes);

  server.listen(port, () => {
    console.log(`Worker process ${process.pid} is listening on port ${port}`);
  });
};

if (cluster.isPrimary) {
  for (let i = 0; i < WORKER_COUNT; i++) {
    const workerPort = DEFAULT_PORT + i + 1;
    const worker = cluster.fork({ WORKER_PORT: workerPort });

    worker.on('message', (msg) => {
      if (msg.type === 'updateUsers') {
        users = [...users, ...msg.data];
      } else if (msg.type === 'removeUsers') {
        users = [...msg.data];
      } else if (msg.type === 'putUsers') {
        users = [...msg.data];
      } else if (msg.type === 'requestUsers') {
        worker.send({ type: 'provideUsers', data: users });
      }
    });
  }

  const loadBalancerServer = createLoadBalancerServer(DEFAULT_PORT);
  loadBalancerServer.listen(DEFAULT_PORT, () => {
    console.log(`Load balancer is listening on port ${DEFAULT_PORT}`);
  });

  cluster.on('exit', (worker) => {
    console.log(
      `Worker process ${worker.process.pid} has exited. Restarting...`
    );
    cluster.fork();
  });
} else {
  const workerPortEnv = process.env.WORKER_PORT;

  if (workerPortEnv) {
    const numericWorkerPort = parseInt(workerPortEnv, 10);
    startWorkerServer(numericWorkerPort);
  } else {
    console.error('WORKER_PORT environment variable is not set');
    process.exit(1);
  }
}
