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
  public statusCode: number
  public errors: ErrorItem[]

  constructor(message?: string) {
    super(message || 'an error occurred')

    this.name = 'BaseError'
    this.statusCode = HTTPStatusCodes.ISE
    this.errors = [
      {
        code: `HSC${this.statusCode}`,
        message: this.message
      }
    ]
  }
}

export class ResourceNotFoundError extends BaseError {
  constructor(message?: string) {
    super(message || 'resource not found')

    this.name = 'ResourceNotFoundError'
    this.statusCode = HTTPStatusCodes.RNF
    this.errors = [
      {
        code: `HSC${this.statusCode}`,
        message: this.message
      }
    ]
  }
}

export class InternalServerError extends BaseError {
  constructor(message?: string) {
    super(message || 'internal server error')

    this.name = 'InternalServerError'
    this.statusCode = HTTPStatusCodes.ISE
    this.errors = [
      {
        code: `HSC${this.statusCode}`,
        message: this.message
      }
    ]
  }
}
