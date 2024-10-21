import cluster from 'cluster';
import { cpus } from 'os';
import http from 'http';
import { userRoutes } from './routes/userRoutes';

const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const totalCPUs = cpus().length;

const createLoadBalancerServer = (port: number) => {
  let currentWorkerIndex = 0;

  return http.createServer((req, res) => {
    const assignedWorkerPort =
      port + (currentWorkerIndex % (totalCPUs - 1)) + 1;
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

    req.pipe(proxyRequest, { end: true });
    currentWorkerIndex++;
  });
};

const startWorkerServer = (port: number) => {
  const server = http.createServer(userRoutes);

  server.listen(port, () => {
    console.log(`Worker ${process.pid} is listening on port ${port}`);
  });
};

if (cluster.isPrimary) {
  console.log(`Primary process is running (PID: ${process.pid})`);

  for (let i = 0; i < totalCPUs - 1; i++) {
    const workerPort = DEFAULT_PORT + i + 1;
    cluster.fork({ WORKER_PORT: workerPort });
  }

  const loadBalancerServer = createLoadBalancerServer(DEFAULT_PORT);
  loadBalancerServer.listen(DEFAULT_PORT, () => {
    console.log(`Load balancer is listening on port ${DEFAULT_PORT}`);
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const workerPortEnv = process.env.WORKER_PORT;

  if (workerPortEnv) {
    const numericWorkerPort = parseInt(workerPortEnv, 10);
    startWorkerServer(numericWorkerPort);
  } else {
    console.error('Error: WORKER_PORT is not defined');
    process.exit(1);
  }
}
