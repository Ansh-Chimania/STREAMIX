const User = require('../models/User');
const Movie = require('../models/Movie');
const Favorite = require('../models/Favorite');
const WatchHistory = require('../models/WatchHistory');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalFavorites = await Favorite.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalMovies,
        totalFavorites,
        bannedUsers,
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password');

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      page: parseInt(page),
      total_pages: Math.ceil(total / limit),
      total_results: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ error: 'Cannot ban admin' });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      success: true,
      message: user.isBanned ? 'User banned' : 'User unbanned',
      user: { id: user._id, name: user.name, isBanned: user.isBanned }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ error: 'Cannot delete admin' });

    await Favorite.deleteMany({ user: user._id });
    await WatchHistory.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User and related data deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
