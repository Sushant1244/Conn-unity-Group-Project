const express = require('express');
const router = express.Router();
const ah = require('../helpers/asyncHandler');
const { authMiddleware } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
    getProfile,
    updateProfile,
    updateAvatar,
    getUserPosts,
    getSavedPosts,
    getUserCommunities,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications
} = require('../controllers/userController');

router.get('/users/:id', ah(getProfile));
router.put('/users/:id', authMiddleware, ah(updateProfile));
router.put('/users/:id/avatar', authMiddleware, upload.single('avatar'), ah(updateAvatar));
router.get('/users/:id/posts', ah(getUserPosts));
router.get('/users/:id/saved', authMiddleware, ah(getSavedPosts));
router.get('/users/:id/communities', ah(getUserCommunities));

// Notifications
router.get('/notifications', authMiddleware, ah(getNotifications));
router.post('/notifications/:id/read', authMiddleware, ah(markNotificationRead));
router.post('/notifications/read-all', authMiddleware, ah(markAllNotificationsRead));
router.delete('/notifications', authMiddleware, ah(clearAllNotifications));

module.exports = router;
