import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './domains/users/models/User';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY as string;

router.post('/register', async (req: Request, res: Response) => {
    const { name, cpf, email, password, role} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const newUser = new User({ name, cpf, email, password:hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Usuário já existe' });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id, email: user.email },
                SECRET_KEY, {
                    expiresIn: '15m',
                });
                res.json({ token });
            } else {
                res.status(401).json({ error: 'Invalid credentials'
                });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal server error'
            });
        }
    });
   
export default router;