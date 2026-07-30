import db from '../config/db.js';

export const getCalendarEvents = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates required' });
    }

    const followups = await db('followups')
      .join('customers', 'followups.customer_id', 'customers.id')
      .whereBetween('followups.date', [start, end])
      .select(
        'followups.id',
        'followups.date',
        'followups.purpose',
        'followups.status',
        'customers.name as customer_name'
      )
      .orderBy('followups.date', 'asc');

    const tasks = await db('tasks')
      .whereNotNull('due_date')
      .whereBetween('due_date', [start, end])
      .select('id', 'title', 'due_date as date', 'status')
      .orderBy('due_date', 'asc');

    const events = [
      ...followups.map(f => ({
        id: f.id,
        type: 'followup',
        date: f.date,
        title: f.purpose,
        description: `Customer: ${f.customer_name}`,
        status: f.status,
        color: f.status === 'Completed' ? 'green' : f.status === 'Missed' ? 'red' : 'blue',
      })),
      ...tasks.map(t => ({
        id: t.id,
        type: 'task',
        date: t.date,
        title: t.title,
        description: 'Task',
        status: t.status,
        color: t.status === 'Completed' ? 'green' : 'orange',
      })),
    ];

    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};