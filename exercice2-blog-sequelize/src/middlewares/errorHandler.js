const { ValidationError, UniqueConstraintError } = require('sequelize');

function errorHandler(err, req, res, next) {
    console.error(err);
    
    if (err instanceof ValidationError) {
        return res.status(400).json({
            error: 'Erreur de validation',
            details: err.errors.map(e => ({ field: e.path, message: e.message }))
        });
    }
    
    if (err instanceof UniqueConstraintError) {
        return res.status(409).json({
            error: 'Email déjà utilisé'
        });
    }
    
    res.status(500).json({ error: 'Erreur interne du serveur' });
}

module.exports = errorHandler;