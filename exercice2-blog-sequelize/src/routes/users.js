const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.sequelize');

router.get('/:id/posts', usersController.getUserPosts);

module.exports = router;