import compiledSchemas from '../validations'
import { Middleware } from '../middlewares'
import userService from '../services/user.service'
import validateData from '../utils/validateData'

export interface NewUserReqData {
  name: string
  email: string
  password: string
  isAdmin?: boolean
}

export interface FindUserReqData {
  id: string
}

export interface ModifyUserReqData {
  id: string
  name?: string
  email?: string
  password?: string
  isAdmin?: boolean
}

export type RemoveUserReqData = FindUserReqData

export interface UserController {
  new: Middleware
  find: Middleware
  findAll: Middleware
  modify: Middleware
  remove: Middleware
}

class StandardUserController implements UserController {
  new: Middleware = async (req, res, next) => {
    try {
      const newUserReqData: NewUserReqData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
      }

      const schema = compiledSchemas.users.new

      validateData(schema, newUserReqData)

      const newUser = await userService.new(newUserReqData)

      return res.status(201).json(newUser)
    } catch (err) {
      return next(err)
    }
  }

  find: Middleware = async (req, res, next) => {
    try {
      const findUserReqData: FindUserReqData = {
        id: req.params.id as string
      }

      const schema = compiledSchemas.users.find

      validateData(schema, findUserReqData)

      const user = await userService.find(findUserReqData)

      return res.status(200).json(user)
    } catch (err) {
      return next(err)
    }
  }

  findAll: Middleware = async (_req, res, next) => {
    try {
      const users = await userService.findAll()

      return res.status(200).json(users)
    } catch (err) {
      return next(err)
    }
  }

  modify: Middleware = async (req, res, next) => {
    try {
      const modifyUserReqData: ModifyUserReqData = {
        id: req.params.id as string,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
      }

      const schema = compiledSchemas.users.modify

      validateData(schema, modifyUserReqData)

      const user = await userService.modify(modifyUserReqData)

      return res.status(200).json(user)
    } catch (err) {
      return next(err)
    }
  }

  remove: Middleware = async (req, res, next) => {
    try {
      const removeUserReqData: RemoveUserReqData = {
        id: req.params.id as string
      }

      const schema = compiledSchemas.users.remove

      validateData(schema, removeUserReqData)

      const status = await userService.remove(removeUserReqData)

      return res.status(status.statusCode).json({ code: status.code })
    } catch (err) {
      return next(err)
    }
  }
}

export default new StandardUserController()
