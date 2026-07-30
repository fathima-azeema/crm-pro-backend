import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await db('users').where({ email }).first();
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [newUser] = await db('users')
      .insert({ name, email, password: hashedPassword, role: role || 'sales_executive' })
      .returning(['id', 'name', 'email', 'role', 'created_at']);

    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await db('users')
      .where({ id: req.user.id })
      .select('id', 'name', 'email', 'role', 'created_at')
      .first();
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/auth/update-profile (NEW)
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    if (email) {
      const existing = await db('users')
        .where({ email })
        .whereNot({ id: userId })
        .first();
      if (existing) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const [updatedUser] = await db('users')
      .where({ id: userId })
      .update({ name, email })
      .returning(['id', 'name', 'email', 'role']);

    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/change-password (NEW)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await db('users').where({ id: userId }).first();
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await db('users').where({ id: userId }).update({ password: hashed });
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};