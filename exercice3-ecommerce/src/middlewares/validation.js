const { body } = require('express-validator');

const validateProduct = [
    body('nom')
        .notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 3 }).withMessage('Le nom doit contenir au moins 3 caractères'),
    
    body('prix')
        .notEmpty().withMessage('Le prix est requis')
        .isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
    
    body('stock')
        .notEmpty().withMessage('Le stock est requis')
        .isInt({ min: 0 }).withMessage('Le stock doit être un entier positif'),
    
    body('categoryId')
        .notEmpty().withMessage('categoryId est requis')
        .isInt({ min: 1 }).withMessage('categoryId doit être un entier positif')
];

const validateOrder = [
    body('userId')
        .notEmpty().withMessage('userId est requis')
        .isInt({ min: 1 }).withMessage('userId doit être un entier positif'),
    
    body('items')
        .isArray({ min: 1 }).withMessage('La commande doit contenir au moins un article'),
    
    body('items.*.productId')
        .isInt({ min: 1 }).withMessage('productId invalide'),
    
    body('items.*.quantite')
        .isInt({ min: 1 }).withMessage('La quantité doit être au moins 1')
];

module.exports = { validateProduct, validateOrder };