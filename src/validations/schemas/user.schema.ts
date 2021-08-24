import { JSONSchemaType } from 'ajv'
import {
  FindAllUserReqData,
  FindUserReqData,
  ModifyUserReqData,
  NewUserReqData,
  RemoveUserReqData
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
    id: {
      type: 'string'
    }
  },
  required: [
    'id'
  ]
}

export const FindAllSchema: JSONSchemaType<FindAllUserReqData> = {
  type: 'object',
  properties: {
    page: {
      type: 'integer',
      minimum: 1,
      nullable: true
    },
    limit: {
      type: 'integer',
      minimum: 1,
      nullable: true
    }
  }
}

export const ModifySchema: JSONSchemaType<ModifyUserReqData> = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 73,
      nullable: true
    },
    email: {
      type: 'string',
      nullable: true
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 64,
      nullable: true
    },
    isAdmin: {
      type: 'boolean',
      nullable: true
    }
  },
  required: [
    'id'
  ]
}

export const RemoveSchema: JSONSchemaType<RemoveUserReqData> = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    }
  },
  required: [
    'id'
  ]
}
