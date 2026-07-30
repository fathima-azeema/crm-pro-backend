import db from '../config/db.js';

// GET /api/customers/:customerId/notes
export const getNotes = async (req, res) => {
  try {
    const { customerId } = req.params;
    const notes = await db('notes')
      .where({ customer_id: customerId })
      .orderBy('created_at', 'desc');
    res.json({ data: notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/customers/:customerId/notes
export const createNote = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { description } = req.body;
    const [newNote] = await db('notes')
      .insert({ customer_id: customerId, description })
      .returning('*');
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await db('notes').where({ id }).del();
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};