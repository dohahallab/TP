const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

function sequelizeErrorHandler(err, req, res, next) {
    console.error(err);
    
    if (err instanceof ValidationError) {
        return res.status(400).json({
            error: 'Erreur de validation',
            details: err.errors.map(e => ({ field: e.path, message: e.message }))
        });
    }
    
    if (err instanceof UniqueConstraintError) {
        return res.status(409).json({
            error: 'Violation de contrainte unique',
            details: err.errors.map(e => ({ field: e.path, message: e.message }))
        });
    }
    
    if (err instanceof ForeignKeyConstraintError) {
        return res.status(400).json({
            error: 'Référence invalide',
            message: `La clé étrangère n'existe pas`
        });
    }
    
    res.status(500).json({ error: 'Erreur interne du serveur' });
}

module.exports = sequelizeErrorHandler;