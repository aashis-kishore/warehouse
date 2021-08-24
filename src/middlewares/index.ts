import { Application, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'

import rnf from './rnf.middleware'
import ise from './ise.middleware'

export interface Middleware {
  (req: Request, res: Response, next: NextFunction): Promise<void | Response>
}

interface UseDefaultMiddlewares {
  (app: Application): void
}

interface UseFallbackMiddlewares {
  (app: Application): void
}

const udm: UseDefaultMiddlewares = (app: Application): void => {
  app.use(helmet())
  app.use(cors())

  app.get('env') !== 'test' && app.use(morgan('dev'))

  app.use(compression())
}

const ufm: UseFallbackMiddlewares = (app: Application): void => {
  rnf(app)
  ise(app)
}

export const useDefaultMiddlewares = udm
export const useFallbackMiddlewares = ufm
