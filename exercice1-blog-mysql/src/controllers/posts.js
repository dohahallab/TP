const pool = require('../config/db');
const { validationResult } = require('express-validator');

async function getAll(req, res, next) {
    try {
        const [rows] = await pool.execute(`
            SELECT posts.*, users.nom AS auteur
            FROM posts 
            JOIN users ON posts.user_id = users.id
            WHERE posts.publie = TRUE
            ORDER BY posts.created_at DESC
        `);
        res.json(rows);
    } catch (err) { 
        next(err); 
    }
}

async function getById(req, res, next) {
    try {
        const { id } = req.params;
        
        const [posts] = await pool.execute(`
            SELECT posts.*, users.nom AS auteur
            FROM posts 
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = ?
        `, [id]);
        
        if (posts.length === 0) {
            return res.status(404).json({ error: 'Post non trouvé' });
        }
        
        const post = posts[0];
        
        const [comments] = await pool.execute(`
            SELECT comments.*, users.nom AS auteur
            FROM comments 
            JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = ?
            ORDER BY comments.created_at DESC
        `, [id]);
        
        res.json({ ...post, commentaires: comments });
    } catch (err) { 
        next(err); 
    }
}

async function create(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { titre, contenu, user_id, publie = false } = req.body;
        
        const [result] = await pool.execute(`
            INSERT INTO posts (titre, contenu, user_id, publie)
            VALUES (?, ?, ?, ?)
        `, [titre, contenu, user_id, publie]);
        
        const [newPost] = await pool.execute(`
            SELECT * FROM posts WHERE id = ?
        `, [result.insertId]);
        
        res.status(201).json(newPost[0]);
    } catch (err) { 
        next(err); 
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        
        const [comments] = await pool.execute(`
            SELECT COUNT(*) as count FROM comments WHERE post_id = ?
        `, [id]);
        
        if (comments[0].count > 0) {
            return res.status(409).json({ 
                error: 'Impossible de supprimer un post avec des commentaires' 
            });
        }
        
        await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
        res.status(204).send();
    } catch (err) { 
        next(err); 
    }
}

module.exports = { getAll, getById, create, remove };