import App from './app'
import logger from './utils/logger'

interface Run {
  (): void
}

export interface Server {
  run: Run
}

class StandardServer implements Server {
  private app: App

  constructor () {
    this.app = App.create()
  }

  run: Run = () => {
    this.app.serve()

    if (process.send) {
      process.send('ready')
    }

    process.on('SIGINT', () => {
      if (this.app.server) {
        this.app.server.close(async () => {
          logger.warn('Disposing server, bye')
        })
      }
    })
  }
}

new StandardServer().run()
