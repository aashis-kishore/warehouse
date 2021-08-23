import mongoose, { Connection } from 'mongoose'
import { EnvVars } from './app'
import logger from './utils/logger'

interface Connect {
  (uri?: string): Promise<Connection>
}

interface Disconnect {
  (): Promise<void>
}

interface DatabaseClient {
  connect: Connect
  disconnect: Disconnect
}

class StandardDatabaseClient implements DatabaseClient {
  private db: null | Connection
  private uri: string

  constructor() {
    const env = process.env as EnvVars

    this.db = null
    this.uri = env.WH_DB_URI || env.DB_URI
  }

  connect: Connect = async (uri?: string): Promise<Connection> => {
    uri && (this.uri = uri)

    return this.establishConnection()
  }

  disconnect: Disconnect = async (): Promise<void> => this.db?.close()

  private establishConnection = async (): Promise<Connection> => {
    if (!this.db) {
      await mongoose.connect(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      })

      this.db = mongoose.connection
    }

    this.db.on('connecting', () => logger.info('Connecting to DB'))
    this.db.on('connected', () => logger.info('Connected to DB'))
    this.db.on('reconnected', () => logger.info('Reconnected to DB'))
    this.db.on('error', () => logger.warn('Error on connecting to DB'))
    this.db.on('disconnected', () => logger.warn('Disconnected to DB'))
    this.db.on('close', () => logger.info('Connection to DB closed'))

    return this.db
  }
}

export default new StandardDatabaseClient()
