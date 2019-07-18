
const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event')

router.get('/', eventController.find)
router.post('/', eventController.create)
router.delete('/:id', eventController.remove)


module.exports = router