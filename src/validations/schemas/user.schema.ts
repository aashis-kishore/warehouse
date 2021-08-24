import { JSONSchemaType } from 'ajv'
import {
  FindUserReqData,
  NewUserReqData
} from '../../controllers/user.controller'

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

export const FindSchema: JSONSchemaType<FindUserReqData> = {
  type: 'object',
  properties: {
    email: {
      type: 'string'
    }
  },
  required: [
    'email'
  ]
}
