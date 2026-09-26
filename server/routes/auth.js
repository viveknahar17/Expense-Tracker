import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
const router = Router();
const makeToken = id => jwt.sign({ id }, process.env.JWT_SECRET || 'development_secret_change_me', { expiresIn: '7d' });
const response = user => ({ token: makeToken(user._id), user: { id: user._id, name: user.name, email: user.email } });
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with that email already exists' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    res.status(201).json(response(user));
  } catch (e) { next(e); }
});
router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Incorrect email or password' });
    res.json(response(user));
  } catch (e) { next(e); }
});
router.get('/me', protect, async (req, res, next) => { try { const user = await User.findById(req.userId).select('-password'); res.json(user); } catch (e) { next(e); } });
export default router;
