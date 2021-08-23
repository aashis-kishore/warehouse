import { Application, Request, Response, NextFunction } from 'express'
import errorManager from '../libs/error-manager'
import { BaseError } from '../libs/error-manager/errors'
import logger from '../utils/logger'

interface ErrorMiddleware {
  (err: BaseError, req: Request, res: Response, next: NextFunction): void
}

const iseHandler: ErrorMiddleware = (
  err: BaseError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void | Response => {
  if (!err.statusCode) {
    err = errorManager.stdErrorFromError(err)
  }

  logger.error(err)

  return res.status(err.statusCode).json({ errors: err.errors })
}

interface ISE {
  (app: Application): void
}

const ise: ISE = (app: Application): void => {
  app.use(iseHandler)
}

export default ise
