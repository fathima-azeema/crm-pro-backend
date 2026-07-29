import db from '../config/db.js';

// GET /api/customers
export const getCustomers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    
    // Base query builder (no .select yet)
    let baseQuery = db('customers');
    
    if (search) {
      baseQuery = baseQuery.where(function() {
        this.where('name', 'ilike', `%${search}%`)
            .orWhere('company', 'ilike', `%${search}%`);
      });
    }
    if (status) {
      baseQuery = baseQuery.where('status', status);
    }

    // Count total records (using a clean clone without select *)
    const { total } = await baseQuery.clone().count({ total: '*' }).first();
    
    // Fetch the actual page
    const customers = await baseQuery
      .clone()
      .select('*')
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('created_at', 'desc');

    res.json({
      data: customers,
      total: Number(total),
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/customers/:id
export const getCustomer = async (req, res) => {
  try {
    const customer = await db('customers').where({ id: req.params.id }).first();
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const { name, company, email, phone, industry, status } = req.body;
    const [newCustomer] = await db('customers')
      .insert({ name, company, email, phone, industry, status })
      .returning('*');
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db('customers')
      .where({ id })
      .update(req.body)
      .returning('*');
    if (!updated.length) return res.status(404).json({ message: 'Customer not found' });
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db('customers').where({ id }).del().returning('*');
    if (!deleted.length) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};