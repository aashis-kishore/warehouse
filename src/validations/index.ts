import Ajv, { ValidateFunction, ErrorObject } from 'ajv'
import {
  FindSchema,
  NewSchema,
  ModifySchema,
  RemoveSchema,
  FindAllSchema
} from './schemas/user.schema'

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
  findAll: ValidateFunction
  modify: ValidateFunction
  remove: ValidateFunction
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
    find: ajv.compile(FindSchema),
    findAll: ajv.compile(FindAllSchema),
    modify: ajv.compile(ModifySchema),
    remove: ajv.compile(RemoveSchema)
  }

  return {
    users
  }
}

export default compileSchemas()
