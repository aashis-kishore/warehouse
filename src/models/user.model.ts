import { model, Schema } from 'mongoose'

export interface User {
  name: string
  email: string
  password: string
  salt: string
  isAdmin: boolean
}

const UserSchema = new Schema<User>({
  name: {
    type: String,
    trim: true,
    minLength: 1,
    maxLength: 73,
    required: '"name" is  required'
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    index: true,
    required: '"email" is required'
  },
  password: {
    type: String,
    required: '"password" is required'
  },
  salt: {
    type: String,
    required: '"salt" is required'
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const UserModel = model<User>('User', UserSchema, 'users')

export default UserModel
