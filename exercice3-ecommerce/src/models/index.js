const sequelize = require('../config/sequelize');
const { DataTypes } = require('sequelize');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Tag = require('./Tag');

Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

const ProductTag = sequelize.define('ProductTag', {
    productId: {
        type: DataTypes.INTEGER,
        field: 'product_id'
    },
    tagId: {
        type: DataTypes.INTEGER,
        field: 'tag_id'
    }
}, {
    tableName: 'product_tags',
    timestamps: false
});

Product.belongsToMany(Tag, { through: ProductTag, foreignKey: 'productId', as: 'tags' });
Tag.belongsToMany(Product, { through: ProductTag, foreignKey: 'tagId', as: 'products' });

module.exports = {
    sequelize,
    Category,
    Product,
    Order,
    OrderItem,
    Tag,
    ProductTag
};