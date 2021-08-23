// Load environment variables
import './utils/loadEnv'

import express from 'express'
import http from 'http'
import { Connection } from 'mongoose'
import net from 'net'
import db from './db'
import logger from './utils/logger'

import {
  useDefaultMiddlewares,
  useFallbackMiddlewares
} from './middlewares'

import useRoutes from './routes'

export interface EnvVars extends NodeJS.ProcessEnv {
  NODE_ENV: string
  PORT?: string
  WH_PORT?: string
  DB_URI: string
  WH_DB_URI: string
}

interface Create {
  // eslint-disable-next-line no-use-before-define
  (): App
}

interface Serve {
  (port?: number): void
}

export interface Application {
  serve: Serve
  server: null | http.Server
  databaseClient: null | Connection
}

class App implements Application {
  private static Instance: null | App
  static create: Create = (): App => {
    if (!App.Instance) {
      App.Instance = new App()
    }

    return App.Instance
  }

  private app: express.Application
  private listener: null | http.Server
  private db: null | Connection

  private constructor() {
    this.app = express()
    this.listener = null
    this.db = null

    this.attachExceptionHandlers()

    const env = process.env as EnvVars
    this.app.set('env', env.NODE_ENV)
    this.app.set('port', env.WH_PORT || env.PORT || 2020)

    useDefaultMiddlewares(this.app)
    useRoutes(this.app)
    useFallbackMiddlewares(this.app)

    this.initDatabase()
  }

  get server(): null | http.Server {
    return this.listener
  }

  get databaseClient(): null | Connection {
    return this.db
  }

  serve: Serve = (port?: number): express.Application => {
    this.app.on('db_ready', () => {
      this.listener = this.app.listen(port || this.app.get('port'), () => {
        const {
          address,
          port
        }: net.AddressInfo = this.listener?.address() as net.AddressInfo

        logger.info(`Application listening on ${address}:${port}`)
      })
    })

    return this.app
  }

  private attachExceptionHandlers = (): void => {
    process.on('uncaughtException', (err: Error) => {
      logger.info(err.stack)

      process.exit(2)
    })
  }

  private initDatabase = async (): Promise<void> => {
    try {
      this.db = await db.connect()
      this.app.emit('db_ready')
    } catch (err) {
      logger.error(err)

      process.exit(2)
    }
  }
}

export default App
