import db from '../config/db.js';

// GET /api/customers/:customerId/followups
export const getFollowups = async (req, res) => {
  try {
    const { customerId } = req.params;
    const followups = await db('followups')
      .where({ customer_id: customerId })
      .orderBy('date', 'desc');
    res.json({ data: followups });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/customers/:customerId/followups
export const createFollowup = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { date, purpose, status } = req.body;
    const [newFollowup] = await db('followups')
      .insert({
        customer_id: customerId,
        date,
        purpose,
        status: status || 'Pending',
      })
      .returning('*');
    res.status(201).json(newFollowup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/followups/:id
export const updateFollowup = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db('followups')
      .where({ id })
      .update(req.body)
      .returning('*');
    if (!updated.length) return res.status(404).json({ message: 'Follow‑up not found' });
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/followups/:id
export const deleteFollowup = async (req, res) => {
  try {
    const { id } = req.params;
    await db('followups').where({ id }).del();
    res.json({ message: 'Follow‑up deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};