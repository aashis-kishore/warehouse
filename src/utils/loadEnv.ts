import dotenv from 'dotenv'

interface Env {
  (): void
}

interface Loader {
  env: Env
}

class StandardLoader implements Loader {
  env: Env = () => {
    dotenv.config()
  }
}

export default new StandardLoader().env()
