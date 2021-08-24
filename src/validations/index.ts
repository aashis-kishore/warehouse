import Ajv, { ValidateFunction, ErrorObject } from 'ajv'
import { FindSchema, NewSchema } from './schemas/user.schema'

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
  find: ValidateFunction
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
    new: ajv.compile(NewSchema),
    find: ajv.compile(FindSchema)
  }

  return {
    users
  }
}

export default compileSchemas()
