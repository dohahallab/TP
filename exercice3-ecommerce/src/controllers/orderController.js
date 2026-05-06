const { Order, OrderItem, Product, sequelize } = require('../models');
const { validationResult } = require('express-validator');

async function getAll(req, res, next) {
    try {
        const orders = await Order.findAll({
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'nom', 'prix']
                }]
            }],
            order: [['created_at', 'DESC']]
        });
        res.json(orders);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'nom', 'prix']
                }]
            }]
        });
        
        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        
        res.json(order);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    const transaction = await sequelize.transaction();
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { userId, items } = req.body;
        
        let total = 0;
        const itemsWithPrice = [];
        
        for (const item of items) {
            const product = await Product.findByPk(item.productId, { transaction });
            
            if (!product) {
                await transaction.rollback();
                return res.status(404).json({ error: `Produit ${item.productId} non trouvé` });
            }
            
            if (product.stock < item.quantite) {
                await transaction.rollback();
                return res.status(400).json({ 
                    error: `Stock insuffisant pour ${product.nom}. Disponible: ${product.stock}` 
                });
            }
            
            const prixUnitaire = parseFloat(product.prix);
            itemsWithPrice.push({
                ...item,
                prixUnitaire,
                subtotal: prixUnitaire * item.quantite
            });
            
            total += prixUnitaire * item.quantite;
        }
        
        const order = await Order.create({
            userId,
            total,
            status: 'PENDING'
        }, { transaction });
        
        for (const item of itemsWithPrice) {
            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantite: item.quantite,
                prixUnitaire: item.prixUnitaire
            }, { transaction });
            
            await Product.update(
                { stock: sequelize.literal(`stock - ${item.quantite}`) },
                { where: { id: item.productId }, transaction }
            );
        }
        
        await transaction.commit();
        
        const createdOrder = await Order.findByPk(order.id, {
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });
        
        res.status(201).json(createdOrder);
    } catch (err) {
        await transaction.rollback();
        next(err);
    }
}

async function updateStatus(req, res, next) {
    try {
        const { status } = req.body;
        const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'CANCELLED'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Statut invalide' });
        }
        
        const order = await Order.findByPk(req.params.id);
        
        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        
        if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
            const transaction = await sequelize.transaction();
            try {
                const items = await OrderItem.findAll({
                    where: { orderId: order.id },
                    transaction
                });
                
                for (const item of items) {
                    await Product.update(
                        { stock: sequelize.literal(`stock + ${item.quantite}`) },
                        { where: { id: item.productId }, transaction }
                    );
                }
                
                await order.update({ status }, { transaction });
                await transaction.commit();
            } catch (err) {
                await transaction.rollback();
                throw err;
            }
        } else {
            await order.update({ status });
        }
        
        res.json(order);
    } catch (err) {
        next(err);
    }
}

async function getStats(req, res, next) {
    try {
        const totalCommandes = await Order.count();
        
        const chiffreAffaires = await Order.sum('total', {
            where: { status: ['CONFIRMED', 'SHIPPED'] }
        });
        
        const produitPlusVendu = await OrderItem.findAll({
            attributes: [
                'productId',
                [sequelize.fn('SUM', sequelize.col('quantite')), 'totalVendus']
            ],
            include: [{
                model: Product,
                as: 'product',
                attributes: ['nom']
            }],
            group: ['productId'],
            order: [[sequelize.fn('SUM', sequelize.col('quantite')), 'DESC']],
            limit: 1
        });
        
        res.json({
            totalCommandes,
            chiffreAffaires: chiffreAffaires || 0,
            produitPlusVendu: produitPlusVendu[0] ? {
                nom: produitPlusVendu[0].product.nom,
                totalVendus: parseInt(produitPlusVendu[0].dataValues.totalVendus)
            } : null
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { create, getById, getAll, updateStatus, getStats };