const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à MySQL établie avec Sequelize');
    } catch (error) {
        console.error('Impossible de se connecter:', error);
    }
})();

module.exports = sequelize;