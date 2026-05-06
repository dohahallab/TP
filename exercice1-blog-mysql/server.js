const express = require('express');
const postsRoutes = require('./src/routes/posts');
const errorHandler = require('./src/middlewares/errorHandler');
require('dotenv').config();

const app = express();
app.use(express.json());

// Ajouter cette ligne pour la route racine
app.get('/', (req, res) => {
    res.json({ message: 'API Blog MySQL - Utilisez /posts pour accéder aux articles' });
});

app.use('/posts', postsRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});