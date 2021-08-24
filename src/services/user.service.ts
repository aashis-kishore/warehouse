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

// interface ModifyUserServiceData {
//   name?: string
//   email?: string
//   password?: string
//   isAdmin?: boolean
// }

// interface Modify {
//   (modifyUserServiceData: ModifyUserServiceData): Promise<void>
// }

// interface RemoveUserServiceData {
//   email: string
// }

// interface Remove {
//   (removeUserServiceData: RemoveUserServiceData): Promise<void>
// }

export interface UserService {
  new: New
  find: Find
  // modify: Modify
  // remove: Remove
}

class StandardUserService implements UserService {
  static ERR_CODES = {
    U001: 'U001' // User does not exist
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

  // modify = async (modifyUserServiceData: ModifyUserServiceData): Promise<void> => {

  // }

  // remove = async (removeUserServiceData: RemoveUserServiceData): Promise<void> => {

  // }
}

export default new StandardUserService()
