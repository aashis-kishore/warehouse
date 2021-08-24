import { Router, json } from 'express'
import userController from '../controllers/user.controller'

const router = Router()

router.post('', json(), userController.new)
router.get('/:id', userController.find)
router.get('', userController.findAll)
router.put('/:id', json(), userController.modify)
router.delete('/:id', userController.remove)

export default router
