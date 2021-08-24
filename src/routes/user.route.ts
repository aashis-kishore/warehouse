import { Router, json } from 'express'
import userController from '../controllers/user.controller'

const router = Router()

router.post('', json(), userController.new)
router.get('/:id', userController.find)
router.put('/:id', json(), userController.modify)

export default router
