
const express = require('express');
const router = express.Router();

const userController = require('../controllers/user')

router.get('/', userController.find)
router.get('/:id', userController.findById)
router.put('/:id', userController.update)
router.post('/', userController.create)
router.delete('/:id', userController.remove)

module.exports = router