const db = require('../services/db.service');

// Create comment on post
exports.createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, parentCommentId } = req.body || {};
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: 'Comment content is required' });
        }

        const comment = await db.createComment(
            parseInt(postId),
            userId,
            content.trim(),
            parentCommentId ? parseInt(parentCommentId) : null
        );

        // Create notification for post author
        const post = await db.getPostById(parseInt(postId));
        if (post && post.author_id !== userId) {
            await db.createNotification(
                post.author_id,
                'comment',
                `New comment on your post: "${post.title}"`,
                parseInt(postId)
            );
        }

        return res.status(201).json({ success: true, comment });
    } catch (error) {
        console.error('Create comment error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get comments for a post
exports.getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await db.getPostComments(parseInt(postId));

        return res.json({ success: true, comments });
    } catch (error) {
        console.error('Get comments error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        // Get comment to check ownership
        const result = await db.query('SELECT * FROM comments WHERE id = $1', [parseInt(id)]);
        const comment = result.rows[0];

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Check if user is author
        if (comment.author_id !== userId) {
            return res.status(403).json({ success: false, message: 'Only comment author can delete' });
        }

        await db.deleteComment(parseInt(id));

        return res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Delete comment error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Vote on comment
exports.voteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { voteType } = req.body || {}; // 1 for upvote, -1 for downvote
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        if (voteType !== 1 && voteType !== -1) {
            return res.status(400).json({ success: false, message: 'Vote type must be 1 or -1' });
        }

        await db.voteComment(userId, parseInt(id), voteType);

        return res.json({ success: true, message: 'Vote recorded', voteType });
    } catch (error) {
        console.error('Vote comment error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
