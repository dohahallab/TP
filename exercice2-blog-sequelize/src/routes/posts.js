const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.sequelize');
const { validerPost } = require('../middlewares/validators/post');

router.get('/', postsController.getAll);
router.get('/:id', postsController.getById);
router.post('/', validerPost, postsController.create);
router.delete('/:id', postsController.remove);

module.exports = router;