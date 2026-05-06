const { Product, Category, OrderItem } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

async function getAll(req, res, next) {
    try {
        const { category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
        
        const where = {};
        
        if (category) {
            where.categoryId = category;
        }
        
        if (minPrice || maxPrice) {
            where.prix = {};
            if (minPrice) where.prix[Op.gte] = parseFloat(minPrice);
            if (maxPrice) where.prix[Op.lte] = parseFloat(maxPrice);
        }
        
        const offset = (page - 1) * limit;
        
        const products = await Product.findAndCountAll({
            where,
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'nom']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });
        
        res.json({
            total: products.count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(products.count / limit),
            data: products.rows
        });
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{
                model: Category,
                as: 'category'
            }]
        });
        
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        
        res.json(product);
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
        
        const category = await Category.findByPk(req.body.categoryId);
        if (!category) {
            return res.status(400).json({ error: 'Catégorie invalide' });
        }
        
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        
        await product.update(req.body);
        res.json(product);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        
        const inOrders = await OrderItem.findOne({
            where: { productId: product.id }
        });
        
        if (inOrders) {
            return res.status(409).json({ 
                error: 'Impossible de supprimer un produit qui a été commandé' 
            });
        }
        
        await product.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAll, getById, create, update, remove };