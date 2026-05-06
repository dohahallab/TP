const { User, Post } = require('../models');

async function getUserPosts(req, res, next) {
    try {
        const { id } = req.params;
        
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        
        const posts = await Post.findAll({
            where: { userId: id },
            include: [{
                model: User,
                as: 'user',
                attributes: ['nom', 'email']
            }],
            order: [['created_at', 'DESC']]
        });
        
        res.json(posts);
    } catch (err) {
        next(err);
    }
}

module.exports = { getUserPosts };