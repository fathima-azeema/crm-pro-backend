import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';  // <-- must be present

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-vercel-app.vercel.app"   // you'll replace this with your actual Vercel URL later
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/calendar', calendarRoutes);  // <-- must be present

app.get('/', (req, res) => {
  res.json({ message: 'CRM Pro API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));