import { randomBytes, scryptSync } from 'crypto'
import errorManager from '../libs/error-manager'
import UserModel, { User } from '../models/user.model'

interface NewUserServiceData {
  name: string
  email: string
  password: string
  isAdmin?: boolean
}

interface NewUserData {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

interface New {
  (newUserServiceData: NewUserServiceData): Promise<NewUserData>
}

interface FindUserServiceData {
  id: string
}

interface Find {
  (findUserServiceData: FindUserServiceData): Promise<User>
}

interface ExtFindUserServiceData {
  email: string
  password?: string
}

interface ExtFindUserData {
  isAdmin: boolean
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

interface ExtFind {
  (extFindUserServiceData: ExtFindUserServiceData): Promise<ExtFindUserData>
}

interface FindAllUserServiceData {
  page?: number
  limit?: number
}

interface FindAll {
  (findAllUserServiceData: FindAllUserServiceData): Promise<User[]>
}

interface ModifyUserServiceData {
  id: string
  name?: string
  email?: string
  password?: string
  isAdmin?: boolean
}

interface Modify {
  (modifyUserServiceData: ModifyUserServiceData): Promise<User>
}

interface RemoveUserServiceData {
  id: string
}

interface RemoveUserData {
  code: string
  statusCode: number
}

interface Remove {
  (removeUserServiceData: RemoveUserServiceData): Promise<RemoveUserData>
}

interface VerifyPassword {
  (hashedPwd: string, candidate: string, salt: string): boolean
}

interface CreateExtFindUserData {
  (user: User): ExtFindUserData
}

export interface UserService {
  new: New
  find: Find
  extFind: ExtFind
  findAll: FindAll
  modify: Modify
  remove: Remove
}

class StandardUserService implements UserService {
  static ERR_CODES = {
    U001: 'U001', // User does not exist
    U002: 'U002', // Operation failed
    U003: 'U003' // Wrong password
  }

  static OP_CODES = {
    UD001: 'UD001', // Remove non-admin
    UD002: 'UD002' // Remove admin
  }

  new = async (newUserServiceData: NewUserServiceData)
    : Promise<NewUserData> => {
    const { password } = newUserServiceData
    const { hashedPassword, salt } = this.hashPassword(password)

    const user = await UserModel.create({
      id: this.generateId(4),
      name: newUserServiceData.name,
      email: newUserServiceData.email,
      password: hashedPassword,
      salt,
      isAdmin: newUserServiceData.isAdmin || false
    })

    const newUser = await user.save()

    return this.createNewUserData(newUser)
  }

  private generateId = (length: number) => {
    return randomBytes(length).toString('hex').toUpperCase()
  }

  private hashPassword = (password: string) => {
    const salt = randomBytes(16).toString('hex')
    const hashedPassword = scryptSync(password, salt, 32).toString('hex')

    return {
      hashedPassword,
      salt
    }
  }

  private createNewUserData = (user: User): NewUserData => ({
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin
  })

  find = async (findUserServiceData: FindUserServiceData): Promise<User> => {
    const user = await UserModel
      .findOne({ id: findUserServiceData.id })
      .select({ _id: 0, password: 0, salt: 0, __v: 0 })

    if (!user) {
      throw errorManager.stdErrorFromName(
        'UnprocessableEntityError',
        {
          code: StandardUserService.ERR_CODES.U001,
          message: 'user does not exist'
        }
      )
    }

    return user
  }

  extFind: ExtFind = async (extFindUserServiceData) => {
    const { email, password } = extFindUserServiceData

    const user = await UserModel
      .findOne({ email })
      .select({ _id: 0, __v: 0 })

    if (!user) {
      throw errorManager.stdErrorFromName(
        'UnprocessableEntityError',
        {
          code: StandardUserService.ERR_CODES.U001,
          message: 'user does not exist'
        }
      )
    }

    if (password && !this.verifyPassword(user.password, password, user.salt)) {
      throw errorManager.stdErrorFromName(
        'UnprocessableEntityError',
        {
          code: StandardUserService.ERR_CODES.U003,
          message: 'wrong password'
        }
      )
    }

    return this.createExtFindUserData(user)
  }

  private createExtFindUserData: CreateExtFindUserData = (user) => ({
    isAdmin: user.isAdmin,
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  })

  private verifyPassword: VerifyPassword = (hashedPwd, candidate, salt) => {
    const hashedCandidate = scryptSync(candidate, salt, 32).toString('hex')

    return hashedPwd === hashedCandidate
  }

  findAll = async (findAllUserServiceData: FindAllUserServiceData)
    : Promise<User[]> => {
    let { page, limit } = findAllUserServiceData

    page = page as number
    limit = limit as number

    const users = await UserModel
      .find({})
      .sort({ time: 1 })
      .select({ _id: 0, password: 0, salt: 0, __v: 0 })
      .skip((page - 1) * limit)
      .limit(limit)

    return users
  }

  modify = async (modifyUserServiceData: ModifyUserServiceData)
    : Promise<User> => {
    const { id } = modifyUserServiceData
    const modifyableFields = this.getModifyableFields(modifyUserServiceData)
    const user = await UserModel
      .findOneAndUpdate({
        id
      },
      { $set: modifyableFields },
      { new: true })
      .select({ _id: 0, password: 0, salt: 0, __v: 0 })

    if (!user) {
      throw errorManager.stdErrorFromName(
        'UnprocessableEntityError',
        {
          code: StandardUserService.ERR_CODES.U001,
          message: 'user does not exist'
        }
      )
    }

    return user
  }

  private getModifyableFields = (modifyUserServiceData: ModifyUserServiceData)
    : Record<string, unknown> => {
    const modifyableFields: Record<string, unknown> = {}

    const { name } = modifyUserServiceData

    name && (modifyableFields.name = name)

    return modifyableFields
  }

  remove = async (removeUserServiceData: RemoveUserServiceData)
    : Promise<RemoveUserData> => {
    const { id } = removeUserServiceData
    const user = await UserModel.findOne({ id })

    if (!user) {
      throw errorManager.stdErrorFromName(
        'UnprocessableEntityError',
        {
          code: StandardUserService.ERR_CODES.U001,
          message: 'user does not exist'
        }
      )
    }

    if (!user.isAdmin) {
      return await this.removeNonAdmin(id)
    }

    return await this.removeAdmin()
  }

  private removeNonAdmin = async (id: string): Promise<RemoveUserData> => {
    const status = await UserModel.deleteOne({ id })

    if (!status.ok) {
      throw errorManager.stdErrorFromName(
        'InternalServerError',
        {
          code: StandardUserService.ERR_CODES.U002,
          message: 'failed to delete user'
        }
      )
    }

    return {
      code: StandardUserService.OP_CODES.UD001,
      statusCode: 200
    }
  }

  private removeAdmin = async (): Promise<RemoveUserData> => {
    return {
      code: StandardUserService.OP_CODES.UD002,
      statusCode: 202
    }
  }
}

export default new StandardUserService()
