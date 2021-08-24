import { Router, json } from 'express'
import userController from '../controllers/user.controller'

const router = Router()

router.post('', json(), userController.new)
router.get('/:id', userController.find)

export default router
