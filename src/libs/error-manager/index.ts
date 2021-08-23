import logger from '../../utils/logger'
import * as errors from './errors'

type ErrorName =
  'ResourceNotFoundError' |
  'InternalServerError'

type ErrorArg = string

interface StdErrorFromName {
  (name: ErrorName, arg?: ErrorArg): errors.BaseError
}

interface StdErrorFromError {
  (err: Error): errors.BaseError
}

export interface ErrorManager {
  stdErrorFromName: StdErrorFromName
  stdErrorFromError: StdErrorFromError
}

class StandardErrorManager implements ErrorManager {
  stdErrorFromName: StdErrorFromName = (
    name: ErrorName,
    arg?: ErrorArg
  ): errors.BaseError => {
    const CustomError = errors[name]

    return CustomError ? new CustomError(arg) : new errors.BaseError()
  }

  stdErrorFromError: StdErrorFromError = (err: Error): errors.BaseError => {
    logger.error(err)

    if (err.name) {
      return this.stdErrorFromName(err.name as ErrorName, err.message)
    }

    return new errors.BaseError()
  }
}

export default new StandardErrorManager()