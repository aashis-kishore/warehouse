import Ajv, { ValidateFunction, ErrorObject } from 'ajv'
import { NewSchema } from './schemas/user.schema'

interface ValidateReturn {
  isValid: boolean
  errors: undefined | null | ErrorObject[]
}

interface Validate {
  <T>(schema: ValidateFunction, data: T): ValidateReturn
}

export const validate: Validate = (schema, data) => ({
  isValid: schema(data),
  errors: schema.errors
})

interface UsersCompiledSchemas {
  new: ValidateFunction
}

interface CompiledSchemas {
  users: UsersCompiledSchemas
}

interface CompileSchemas {
  (): CompiledSchemas
}

const compileSchemas: CompileSchemas = () => {
  const ajv = new Ajv()

  const users: UsersCompiledSchemas = {
    new: ajv.compile(NewSchema)
  }

  return {
    users
  }
}

export default compileSchemas()
