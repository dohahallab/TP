const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateOrder } = require('../middlewares/validation');

router.post('/', validateOrder, orderController.create);
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.patch('/:id/status', orderController.updateStatus);
router.get('/stats/all', orderController.getStats);

module.exports = router;