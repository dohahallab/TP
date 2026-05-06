const pool = require('../config/db');

async function getUserPosts(req, res, next) {
    try {
        const { id } = req.params;
        
        const [posts] = await pool.execute(`
            SELECT posts.*, users.nom AS auteur
            FROM posts 
            JOIN users ON posts.user_id = users.id
            WHERE posts.user_id = ?
            ORDER BY posts.created_at DESC
        `, [id]);
        
        if (posts.length === 0 && id) {
            const [user] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
            if (user.length === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
        }
        
        res.json(posts);
    } catch (err) {
        next(err);
    }
}

module.exports = { getUserPosts };