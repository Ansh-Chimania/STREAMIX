const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, banUser, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/ban', banUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
