import db from '../config/db.js';

// GET /api/tasks?status=&assigned_to=
export const getTasks = async (req, res) => {
  try {
    const { status, assigned_to, page = 1, limit = 100 } = req.query;
    let query = db('tasks')
      .leftJoin('users', 'tasks.assigned_to', 'users.id')
      .select('tasks.*', 'users.name as assigned_user_name');

    if (status) query = query.where('tasks.status', status);
    if (assigned_to) query = query.where('tasks.assigned_to', assigned_to);

    const tasks = await query
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('tasks.created_at', 'desc');

    res.json({ data: tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, due_date, assigned_to } = req.body;
    const [newTask] = await db('tasks')
      .insert({
        title,
        description,
        priority: priority || 'Medium',
        status: status || 'Pending',
        due_date,
        assigned_to: assigned_to || null,
      })
      .returning('*');
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db('tasks')
      .where({ id })
      .update(req.body)
      .returning('*');
    if (!updated.length) return res.status(404).json({ message: 'Task not found' });
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db('tasks').where({ id }).del().returning('*');
    if (!deleted.length) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};