function errorHandler(err, req, res, next) {
    console.error(err);
    
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email déjà utilisé' });
    }
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'user_id invalide' });
    }
    
    res.status(500).json({ error: 'Erreur interne du serveur' });
}

module.exports = errorHandler;