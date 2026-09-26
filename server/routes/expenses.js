import { Router } from 'express';
import Expense from '../models/Expense.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.use(protect);
router.get('/', async (req, res, next) => { try {
  const filter = { user: req.userId };
  if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
  const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 }); res.json(expenses);
} catch (e) { next(e); } });
router.get('/summary', async (req, res, next) => { try {
  const byCategory = await Expense.aggregate([{ $match: { user: req.userId } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }, { $sort: { total: -1 } }]);
  const total = byCategory.reduce((sum, item) => sum + item.total, 0); res.json({ total, byCategory });
} catch (e) { next(e); } });
router.post('/', async (req, res, next) => { try { res.status(201).json(await Expense.create({ ...req.body, user: req.userId })); } catch (e) { next(e); } });
router.put('/:id', async (req, res, next) => { try {
  const expense = await Expense.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true, runValidators: true });
  if (!expense) return res.status(404).json({ message: 'Expense not found' }); res.json(expense);
} catch (e) { next(e); } });
router.delete('/:id', async (req, res, next) => { try {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!expense) return res.status(404).json({ message: 'Expense not found' }); res.json({ message: 'Expense deleted' });
} catch (e) { next(e); } });
export default router;
