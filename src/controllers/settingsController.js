import db from '../config/db.js';

// GET /api/settings
export const getSettings = async (req, res) => {
  try {
    const settings = await db('settings').first();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/settings
export const updateSettings = async (req, res) => {
  try {
    const { company_name, company_logo } = req.body;
    const [updated] = await db('settings')
      .where({ id: 1 })   // the only row
      .update({ company_name, company_logo })
      .returning('*');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};