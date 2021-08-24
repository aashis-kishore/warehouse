import { Application } from 'express'
import { Middleware } from '.'
import errorManager from '../libs/error-manager'

interface RNF {
  (app: Application): void
}

const rnfHandler: Middleware = async (
  _req,
  _res,
  next
) => {
  return next(errorManager.stdErrorFromName('ResourceNotFoundError'))
}

const rnf: RNF = (app: Application): void => {
  app.use(rnfHandler)
}

export default rnf
