const express = require('express');
const router = express.Router();
const ah = require('../helpers/asyncHandler');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
    getAllCommunities,
    createCommunity,
    getCommunity,
    updateCommunity,
    deleteCommunity,
    joinCommunity,
    leaveCommunity
} = require('../controllers/communityController');

router.get('/communities', ah(getAllCommunities));
router.post('/communities', authMiddleware, upload.single('image'), ah(createCommunity));
router.get('/communities/:id', ah(getCommunity));
router.put('/communities/:id', authMiddleware, ah(updateCommunity));
router.delete('/communities/:id', authMiddleware, ah(deleteCommunity));
router.post('/communities/:id/join', authMiddleware, ah(joinCommunity));
router.post('/communities/:id/leave', authMiddleware, ah(leaveCommunity));

module.exports = router;
