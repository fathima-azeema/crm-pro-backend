import db from '../config/db.js';

// GET /api/employees
export const getEmployees = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    // Build a base query without select
    let baseQuery = db('employees');

    if (search) {
      baseQuery = baseQuery.where(function () {
        this.where('name', 'ilike', `%${search}%`)
            .orWhere('email', 'ilike', `%${search}%`);
      });
    }

    // Count total separately (no select * before count)
    const countQuery = baseQuery.clone().count({ total: '*' }).first();
    
    // Actual data fetch
    const employees = await baseQuery
      .clone()
      .select('*')
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('created_at', 'desc');

    const { total } = await countQuery;

    res.json({
      data: employees,
      total: Number(total),
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/employees
export const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, position } = req.body;
    const [newEmployee] = await db('employees')
      .insert({ name, email, phone, position })
      .returning('*');
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db('employees')
      .where({ id })
      .update(req.body)
      .returning('*');
    if (!updated.length) return res.status(404).json({ message: 'Employee not found' });
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db('employees').where({ id }).del().returning('*');
    if (!deleted.length) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};