const { Post, User, Comment } = require('../models');
const { validationResult } = require('express-validator');

async function getAll(req, res, next) {
    try {
        const posts = await Post.findAll({
            where: { publie: true },
            include: [{
                model: User,
                as: 'user',
                attributes: ['nom']
            }],
            order: [['created_at', 'DESC']]
        });
        res.json(posts);
    } catch (err) { 
        next(err); 
    }
}

async function getById(req, res, next) {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['nom', 'email']
                },
                {
                    model: Comment,
                    as: 'comments',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['nom']
                    }]
                }
            ]
        });
        
        if (!post) {
            return res.status(404).json({ error: 'Post non trouvé' });
        }
        
        res.json(post);
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
        
        const post = await Post.create({
            titre,
            contenu,
            userId: user_id,
            publie
        });
        
        res.status(201).json(post);
    } catch (err) { 
        next(err); 
    }
}

async function remove(req, res, next) {
    try {
        const post = await Post.findByPk(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: 'Post non trouvé' });
        }
        
        const commentCount = await Comment.count({
            where: { postId: post.id }
        });
        
        if (commentCount > 0) {
            return res.status(409).json({ 
                error: 'Impossible de supprimer un post avec des commentaires' 
            });
        }
        
        await post.destroy();
        res.status(204).send();
    } catch (err) { 
        next(err); 
    }
}

module.exports = { getAll, getById, create, remove };