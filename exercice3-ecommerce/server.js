const express = require('express');
const { sequelize } = require('./src/models');
const categoriesRoutes = require('./src/routes/categories');
const productsRoutes = require('./src/routes/products');
const ordersRoutes = require('./src/routes/orders');
const sequelizeErrorHandler = require('./src/middlewares/sequelizeErrorHandler');
require('dotenv').config();

const app = express();
app.use(express.json());

// AJOUTEZ CETTE LIGNE
app.get('/', (req, res) => {
    res.json({ 
        message: 'API E-commerce',
        endpoints: {
            categories: 'GET /categories, POST /categories',
            products: 'GET /products, GET /products/:id, POST /products, PUT /products/:id, DELETE /products/:id',
            orders: 'POST /orders, GET /orders/:id, PATCH /orders/:id/status, GET /orders/stats/all'
        }
    });
});

app.use('/categories', categoriesRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

app.use(sequelizeErrorHandler);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Base de données synchronisée');
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Erreur de synchronisation:', err);
    });