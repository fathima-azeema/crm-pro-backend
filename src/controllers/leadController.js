import db from '../config/db.js';

// GET /api/leads
export const getLeads = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    let query = db('leads').select('*');

    if (status) query = query.where('status', status);

    const leads = await query
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('created_at', 'desc');

    res.json({ data: leads });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/leads
export const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, source, status } = req.body;
    const [newLead] = await db('leads')
      .insert({ name, email, phone, company, source, status: status || 'New' })
      .returning('*');
    res.status(201).json(newLead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/leads/:id
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db('leads')
      .where({ id })
      .update(req.body)
      .returning('*');
    if (!updated.length) return res.status(404).json({ message: 'Lead not found' });
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/leads/:id
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db('leads').where({ id }).del().returning('*');
    if (!deleted.length) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};