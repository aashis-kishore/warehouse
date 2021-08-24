import { JSONSchemaType } from 'ajv'
import { NewUserReqData } from '../../controllers/user.controller'

export const NewSchema: JSONSchemaType<NewUserReqData> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 73
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 64
    },
    isAdmin: {
      type: 'boolean',
      nullable: true
    }
  },
  required: [
    'name',
    'email',
    'password'
  ]
}
