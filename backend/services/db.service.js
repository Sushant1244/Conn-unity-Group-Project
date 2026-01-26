const { query, pool, getClient } = require('../config/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// ============= USER OPERATIONS =============

async function createUser(username, email, password) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, email_verified, created_at',
        [username, email, passwordHash]
    );
    return result.rows[0];
}

async function getUserByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

async function getUserById(id) {
    const result = await query('SELECT id, username, email, email_verified, avatar_url, bio, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
}

async function getUserByUsername(username) {
    const result = await query('SELECT id, username, email, email_verified, avatar_url, bio, created_at FROM users WHERE username = $1', [username]);
    return result.rows[0];
}

async function updateUser(id, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updates.username) {
        fields.push(`username = $${paramIndex++}`);
        values.push(updates.username);
    }
    if (updates.bio !== undefined) {
        fields.push(`bio = $${paramIndex++}`);
        values.push(updates.bio);
    }
    if (updates.avatar_url !== undefined) {
        fields.push(`avatar_url = $${paramIndex++}`);
        values.push(updates.avatar_url);
    }
    if (updates.email_verified !== undefined) {
        fields.push(`email_verified = $${paramIndex++}`);
        values.push(updates.email_verified);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, username, email, email_verified, avatar_url, bio`,
        values
    );
    return result.rows[0];
}

async function verifyUserPassword(email, password) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (isValid) {
        // Return user without password hash
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
}

// ============= OTP OPERATIONS =============

async function createOTP(email, otpCode, expiryMinutes = 10) {
    const expiresAt = new Date(Date.now() + expiryMinutes * 60000);
    const result = await query(
        'INSERT INTO otp_codes (email, otp_code, expires_at) VALUES ($1, $2, $3) RETURNING *',
        [email, otpCode, expiresAt]
    );
    return result.rows[0];
}

async function verifyOTP(email, otpCode) {
    const result = await query(
        'SELECT * FROM otp_codes WHERE email = $1 AND otp_code = $2 AND verified = false AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
        [email, otpCode]
    );

    if (result.rows.length === 0) return false;

    // Mark as verified
    await query('UPDATE otp_codes SET verified = true WHERE id = $1', [result.rows[0].id]);
    return true;
}

async function cleanupExpiredOTPs() {
    await query('DELETE FROM otp_codes WHERE expires_at < NOW()');
}

// ============= COMMUNITY OPERATIONS =============

async function createCommunity(name, displayName, description, topics, imageUrl, creatorId) {
    const result = await query(
        'INSERT INTO communities (name, display_name, description, topics, image_url, creator_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, displayName, description, topics || [], imageUrl, creatorId]
    );
    return result.rows[0];
}

async function getCommunityById(id) {
    const result = await query('SELECT * FROM communities WHERE id = $1', [id]);
    return result.rows[0];
}

async function getCommunityByName(name) {
    const result = await query('SELECT * FROM communities WHERE name = $1', [name]);
    return result.rows[0];
}

async function getAllCommunities(limit = 50, offset = 0) {
    const result = await query(
        'SELECT * FROM communities ORDER BY member_count DESC, created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
    );
    return result.rows;
}

async function updateCommunity(id, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updates.display_name) {
        fields.push(`display_name = $${paramIndex++}`);
        values.push(updates.display_name);
    }
    if (updates.description !== undefined) {
        fields.push(`description = $${paramIndex++}`);
        values.push(updates.description);
    }
    if (updates.topics) {
        fields.push(`topics = $${paramIndex++}`);
        values.push(updates.topics);
    }
    if (updates.image_url !== undefined) {
        fields.push(`image_url = $${paramIndex++}`);
        values.push(updates.image_url);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(
        `UPDATE communities SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
    );
    return result.rows[0];
}

async function deleteCommunity(id) {
    await query('DELETE FROM communities WHERE id = $1', [id]);
}

// ============= COMMUNITY MEMBERSHIP =============

async function joinCommunity(userId, communityId) {
    try {
        const result = await query(
            'INSERT INTO community_members (user_id, community_id) VALUES ($1, $2) RETURNING *',
            [userId, communityId]
        );
        return result.rows[0];
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return null; // Already a member
        }
        throw error;
    }
}

async function leaveCommunity(userId, communityId) {
    await query('DELETE FROM community_members WHERE user_id = $1 AND community_id = $2', [userId, communityId]);
}

async function getUserCommunities(userId) {
    const result = await query(
        `SELECT c.* FROM communities c
     INNER JOIN community_members cm ON c.id = cm.community_id
     WHERE cm.user_id = $1
     ORDER BY cm.joined_at DESC`,
        [userId]
    );
    return result.rows;
}

async function isMember(userId, communityId) {
    const result = await query(
        'SELECT 1 FROM community_members WHERE user_id = $1 AND community_id = $2',
        [userId, communityId]
    );
    return result.rows.length > 0;
}

// ============= POST OPERATIONS =============

async function createPost(communityId, authorId, title, body, category, tag, mood, mediaUrl, mediaType) {
    const result = await query(
        `INSERT INTO posts (community_id, author_id, title, body, category, tag, mood, media_url, media_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [communityId, authorId, title, body, category, tag, mood, mediaUrl, mediaType]
    );
    return result.rows[0];
}

async function getPostById(id) {
    const result = await query(
        `SELECT p.*, u.username as author_username, c.name as community_name
     FROM posts p
     JOIN users u ON p.author_id = u.id
     JOIN communities c ON p.community_id = c.id
     WHERE p.id = $1`,
        [id]
    );
    return result.rows[0];
}

async function getPosts(filters = {}, limit = 20, offset = 0) {
    let baseQuery = `
    SELECT p.*, u.username as author_username, c.name as community_name
    FROM posts p
    JOIN users u ON p.author_id = u.id
    JOIN communities c ON p.community_id = c.id
    WHERE 1=1
  `;

    const params = [];
    let paramIndex = 1;

    if (filters.communityId) {
        baseQuery += ` AND p.community_id = $${paramIndex++}`;
        params.push(filters.communityId);
    }
    if (filters.authorId) {
        baseQuery += ` AND p.author_id = $${paramIndex++}`;
        params.push(filters.authorId);
    }
    if (filters.search) {
        baseQuery += ` AND (p.title ILIKE $${paramIndex} OR p.body ILIKE $${paramIndex})`;
        params.push(`%${filters.search}%`);
        paramIndex++;
    }

    baseQuery += ` ORDER BY p.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(limit, offset);

    const result = await query(baseQuery, params);
    return result.rows;
}

async function updatePost(id, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updates.title) {
        fields.push(`title = $${paramIndex++}`);
        values.push(updates.title);
    }
    if (updates.body) {
        fields.push(`body = $${paramIndex++}`);
        values.push(updates.body);
    }
    if (updates.category !== undefined) {
        fields.push(`category = $${paramIndex++}`);
        values.push(updates.category);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(
        `UPDATE posts SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
    );
    return result.rows[0];
}

async function deletePost(id) {
    await query('DELETE FROM posts WHERE id = $1', [id]);
}

// ============= COMMENT OPERATIONS =============

async function createComment(postId, authorId, content, parentCommentId = null) {
    const result = await query(
        'INSERT INTO comments (post_id, author_id, content, parent_comment_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [postId, authorId, content, parentCommentId]
    );
    return result.rows[0];
}

async function getPostComments(postId) {
    const result = await query(
        `SELECT c.*, u.username as author_username
     FROM comments c
     JOIN users u ON c.author_id = u.id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
        [postId]
    );
    return result.rows;
}

async function deleteComment(id) {
    await query('DELETE FROM comments WHERE id = $1', [id]);
}

// ============= VOTE OPERATIONS =============

async function votePost(userId, postId, voteType) {
    try {
        const result = await query(
            `INSERT INTO votes (user_id, post_id, vote_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, post_id)
       DO UPDATE SET vote_type = $3
       RETURNING *`,
            [userId, postId, voteType]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function removePostVote(userId, postId) {
    await query('DELETE FROM votes WHERE user_id = $1 AND post_id = $2', [userId, postId]);
}

async function voteComment(userId, commentId, voteType) {
    try {
        const result = await query(
            `INSERT INTO votes (user_id, comment_id, vote_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, comment_id)
       DO UPDATE SET vote_type = $3
       RETURNING *`,
            [userId, commentId, voteType]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function getUserVote(userId, postId = null, commentId = null) {
    if (postId) {
        const result = await query('SELECT * FROM votes WHERE user_id = $1 AND post_id = $2', [userId, postId]);
        return result.rows[0];
    }
    if (commentId) {
        const result = await query('SELECT * FROM votes WHERE user_id = $1 AND comment_id = $2', [userId, commentId]);
        return result.rows[0];
    }
    return null;
}

// ============= SAVED POSTS =============

async function savePost(userId, postId) {
    try {
        const result = await query(
            'INSERT INTO saved_posts (user_id, post_id) VALUES ($1, $2) RETURNING *',
            [userId, postId]
        );
        return result.rows[0];
    } catch (error) {
        if (error.code === '23505') return null; // Already saved
        throw error;
    }
}

async function unsavePost(userId, postId) {
    await query('DELETE FROM saved_posts WHERE user_id = $1 AND post_id = $2', [userId, postId]);
}

async function getSavedPosts(userId, limit = 20, offset = 0) {
    const result = await query(
        `SELECT p.*, u.username as author_username, c.name as community_name, sp.saved_at
     FROM saved_posts sp
     JOIN posts p ON sp.post_id = p.id
     JOIN users u ON p.author_id = u.id
     JOIN communities c ON p.community_id = c.id
     WHERE sp.user_id = $1
     ORDER BY sp.saved_at DESC
     LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    );
    return result.rows;
}

async function isPostSaved(userId, postId) {
    const result = await query('SELECT 1 FROM saved_posts WHERE user_id = $1 AND post_id = $2', [userId, postId]);
    return result.rows.length > 0;
}

// ============= NOTIFICATIONS =============

async function createNotification(userId, type, content, postId = null) {
    const result = await query(
        'INSERT INTO notifications (user_id, type, content, post_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, type, content, postId]
    );
    return result.rows[0];
}

async function getUserNotifications(userId, limit = 50) {
    const result = await query(
        'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
        [userId, limit]
    );
    return result.rows;
}

async function markNotificationAsRead(id) {
    await query('UPDATE notifications SET is_read = true WHERE id = $1', [id]);
}

async function markAllNotificationsAsRead(userId) {
    await query('UPDATE notifications SET is_read = true WHERE user_id = $1', [userId]);
}

async function deleteNotification(id) {
    await query('DELETE FROM notifications WHERE id = $1', [id]);
}

async function clearAllNotifications(userId) {
    await query('DELETE FROM notifications WHERE user_id = $1', [userId]);
}

module.exports = {
    // Users
    createUser,
    getUserByEmail,
    getUserById,
    getUserByUsername,
    updateUser,
    verifyUserPassword,

    // OTP
    createOTP,
    verifyOTP,
    cleanupExpiredOTPs,

    // Communities
    createCommunity,
    getCommunityById,
    getCommunityByName,
    getAllCommunities,
    updateCommunity,
    deleteCommunity,

    // Community Membership
    joinCommunity,
    leaveCommunity,
    getUserCommunities,
    isMember,

    // Posts
    createPost,
    getPostById,
    getPosts,
    updatePost,
    deletePost,

    // Comments
    createComment,
    getPostComments,
    deleteComment,

    // Votes
    votePost,
    removePostVote,
    voteComment,
    getUserVote,

    // Saved Posts
    savePost,
    unsavePost,
    getSavedPosts,
    isPostSaved,

    // Notifications
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
};
