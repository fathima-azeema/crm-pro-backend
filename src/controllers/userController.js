import db from '../config/db.js';

// GET /api/users
export const getUsers = async (req, res) => {
  try {
    const users = await db('users').select('id', 'name', 'email', 'role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};