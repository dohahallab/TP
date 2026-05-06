const { Category, Product } = require('../models');
const { validationResult } = require('express-validator');

async function getAll(req, res, next) {
    try {
        const categories = await Category.findAll({
            include: [{
                model: Product,
                as: 'products',
                attributes: ['id', 'nom', 'prix']
            }]
        });
        res.json(categories);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (err) {
        next(err);
    }
}

module.exports = { getAll, create };