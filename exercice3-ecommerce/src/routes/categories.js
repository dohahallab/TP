const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { body } = require('express-validator');

const validateCategory = [
    body('nom')
        .notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères')
];

router.get('/', categoryController.getAll);
router.post('/', validateCategory, categoryController.create);

module.exports = router;