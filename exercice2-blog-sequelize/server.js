const express = require('express');
const sequelize = require('./src/config/sequelize');
const postsRoutes = require('./src/routes/posts');
const usersRoutes = require('./src/routes/users');
const errorHandler = require('./src/middlewares/errorHandler');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API Blog Sequelize - Utilisez /posts pour accéder aux articles' });
});

app.use('/posts', postsRoutes);
app.use('/users', usersRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Modèles synchronisés avec la base de données');
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Erreur de synchronisation:', err);
    });