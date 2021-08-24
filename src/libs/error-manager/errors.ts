import { ErrorArg, SubError } from '.'
import { MongoError as MError } from 'mongodb'
import { DefinedError, ErrorObject } from 'ajv'

interface ErrorItem {
  code?: string
  message: string
}

enum HTTPStatusCodes {
  BR = 400,
  UNAUTH = 401,
  RNF = 404,
  UE = 422,
  ISE = 500,
  BG = 502,
  NAR = 511
}

export class BaseError extends Error {
  static DEFAULT_ERR_CODE = 'DEC000'

  public statusCode: number
  public errors: ErrorItem[]

  constructor(arg?: ErrorArg) {
    super('an error occurred')

    this.name = 'BaseError'
    this.statusCode = HTTPStatusCodes.ISE
    this.message = this.getMessage(arg)
    this.errors = [
      {
        code: (arg as SubError)?.code || BaseError.DEFAULT_ERR_CODE,
        message: this.message
      }
    ]
  }

  private getMessage = (arg?: ErrorArg): string => {
    if (typeof arg === 'string') {
      return arg
    }

    if ((arg as SubError)?.message) {
      return (arg as SubError).message
    }

    return this.message
  }
}

export class ResourceNotFoundError extends BaseError {
  constructor(arg?: ErrorArg) {
    super(arg || 'resource not found')

    this.name = 'ResourceNotFoundError'
    this.statusCode = HTTPStatusCodes.RNF
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(arg?: ErrorArg) {
    super(arg || 'unprocessable entity')

    this.name = 'UnprocessableEntityError'
    this.statusCode = HTTPStatusCodes.UE
  }
}

export class InternalServerError extends BaseError {
  constructor(arg?: ErrorArg) {
    super(arg || 'internal server error')

    this.name = 'InternalServerError'
    this.statusCode = HTTPStatusCodes.ISE
  }
}

export class MongoError extends BaseError {
  constructor(err?: ErrorArg) {
    super((err as MError).message)

    this.name = 'MongoError'
    this.statusCode = HTTPStatusCodes.UE
    this.errors = [
      {
        code: `${(err as MError).code}` || BaseError.DEFAULT_ERR_CODE,
        message: this.message
      }
    ]
  }
}

export class SyntaxError extends BaseError {
  constructor(err?: ErrorArg) {
    super((err as Error).message || 'syntax error')

    this.name = 'SyntaxError'
    this.statusCode = HTTPStatusCodes.BR
  }
}

export class AjvValidationError extends BaseError {
  constructor(err?: ErrorArg) {
    super('validation failure')

    this.name = 'AjvValidationError'
    this.statusCode = HTTPStatusCodes.BR
    this.errors = []
    this.extractMessages(err as ErrorObject[])
  }

  private extractMessages = (errors?: ErrorObject[]) => {
    if (errors) {
      for (const err of errors as DefinedError[]) {
        this.errors.push({
          code: `AJV${err.keyword.toUpperCase()}`,
          message: `${err.instancePath.slice(1)} ${err.message}`
        })
      }
    }
  }
}
