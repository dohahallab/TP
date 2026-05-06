const { body } = require('express-validator');

const validerPost = [
    body('titre')
        .notEmpty().withMessage('Le titre est requis')
        .isLength({ min: 5 }).withMessage('Le titre doit contenir au moins 5 caractères'),
    
    body('contenu')
        .notEmpty().withMessage('Le contenu est requis')
        .isLength({ min: 10 }).withMessage('Le contenu doit contenir au moins 10 caractères'),
    
    body('user_id')
        .notEmpty().withMessage('user_id est requis')
        .isInt({ min: 1 }).withMessage('user_id doit être un entier positif'),
    
    body('publie')
        .optional()
        .isBoolean().withMessage('publie doit être un booléen')
];

module.exports = { validerPost };