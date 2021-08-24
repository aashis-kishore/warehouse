import { ValidateFunction } from 'ajv'
import errorManager from '../libs/error-manager'
import { validate } from '../validations'

interface ValidateData {
  <T>(schema: ValidateFunction, data: T): void
}

const validateData: ValidateData = (schema, data) => {
  const status = validate(schema, data)

  if (!status.isValid) {
    throw errorManager.stdErrorFromName(
      'AjvValidationError',
      status.errors
    )
  }
}

export default validateData
