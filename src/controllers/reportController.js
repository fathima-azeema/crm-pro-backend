import db from '../config/db.js';

// GET /api/reports/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    // Total customers
    const [{ count: totalCustomers }] = await db('customers').count();
    const [{ count: activeCustomers }] = await db('customers').where('status', 'Active').count();

    // Leads
    const [{ count: totalLeads }] = await db('leads').count();
    const [{ count: wonLeads }] = await db('leads').where('status', 'Won').count();

    // Tasks
    const [{ count: pendingTasks }] = await db('tasks').where('status', 'Pending').count();

    // Monthly revenue (placeholder)
    const monthlyRevenue = 0;

    // Recent customers (last 5)
    const recentCustomers = await db('customers')
      .select('id', 'name', 'company', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(5);

    // Leads by status for pie chart
    const leadsByStatus = await db('leads')
      .select('status')
      .count('* as count')
      .groupBy('status');

    // Monthly customer growth (last 6 months)
    const customerGrowth = await db.raw(`
      SELECT date_trunc('month', created_at) as month, COUNT(*) as count
      FROM customers
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month
    `);

    res.json({
      totalCustomers: Number(totalCustomers),
      activeCustomers: Number(activeCustomers),
      totalLeads: Number(totalLeads),
      wonLeads: Number(wonLeads),
      pendingTasks: Number(pendingTasks),
      monthlyRevenue,
      recentCustomers,
      leadsByStatus,
      customerGrowth: customerGrowth.rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/tasks
export const getTaskStats = async (req, res) => {
  try {
    const tasksByStatus = await db('tasks')
      .select('status')
      .count('* as count')
      .groupBy('status');

    const [{ total }] = await db('tasks').count('* as total');
    const [{ completed }] = await db('tasks').where('status', 'Completed').count('* as completed');

    res.json({
      total: Number(total),
      completed: Number(completed),
      completionRate: total > 0 ? Math.round((Number(completed) / Number(total)) * 100) : 0,
      byStatus: tasksByStatus.map((row) => ({
        status: row.status,
        count: Number(row.count),
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};