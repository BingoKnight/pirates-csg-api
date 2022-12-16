import cluster from 'cluster'
import debug from 'debug'
import http from 'http'
import { cpus } from 'os'
import process from 'process'

import mongoose from 'mongoose'

import config from '../common/config.js'

const debug_logger = debug('csg-pirates-api:server')

export function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

export function onError(error) {
  console.log(error)
  const port = error.port

  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}


export function onListening(server) {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug_logger('Listening on ' + bind);
}


export function connectDb() {
    mongoose.connection
        .on('error', console.log)
        .on('disconnected', console.log)
        .once('open', () => console.log('Database connection established'))

    return mongoose.connect(config.MONGO_CONNECTION_URI, {
        user: config.DB_USER,
        pass: config.DB_PASSWORD,
        dbName: config.DB_NAME,
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

export default function startServer(app) {
    const port = normalizePort(process.env.PORT || '8080')

    if (cluster.isPrimary && config.NODE_ENV === 'production'){
        const cpuLength = cpus().length
        const workerCount = cpus().length * 2 + 1

        console.log(`Found ${cpuLength} CPUs, will spawn ${workerCount} workers`)

        for (let i = 0; i < workerCount; i++) {
            cluster.fork()
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker: ${worker.process.pid} died`)
        })
    } else {
        app.set('port', port)

        const server = http.createServer(app)
        server.listen(port)
        server.on('error', onError)
        server.on('listening', () => onListening(server))

        console.log(`Worker ${process.pid} started`)
    }

    console.log(`Listening on port ${port}`)
}

