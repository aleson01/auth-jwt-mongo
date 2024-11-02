import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authMiddleware } from './middleware/authMiddleware';
import User from './domains/users/models/User';
import { roleMiddleware } from './middleware/roleMiddleware';

const router = express.Router();

router.get('/profile', authMiddleware, async (req: Request, res:Response) => {
    try {
        const user = await User.findById((req.user as any).id);
        res.json({ message: 'Bem vindo ao Seu Perfil', user });
    } catch (error) {
        res.status(500).json({ error: 'Usuário não encontrado' });
    }
});

router.post('/edit',authMiddleware, async (req: Request, res: Response) => {
    const {_id, name, cpf, email, password, role} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
        
    try {
        const user = await User.findByIdAndUpdate(_id, {_id:_id ,name: name, cpf: cpf, email: email, password:hashedPassword, role:role});
        if (!user) {
            return null; // Usuário não encontrado
        }
        return user;

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
    return null;
    }
});

router.get('/admin', authMiddleware, roleMiddleware(['admin']), async (req: Request, res:Response) => {
    res.json({ message: 'Conteudo exclusivo para administrador', user: req.user });
});

router.get('/dashboard', authMiddleware, async (req: Request, res:Response) => {
    res.json({ message: 'Bem vindo ao painel de controle', user: req.user });
});

router.get('/settings', authMiddleware, async (req: Request, res:Response) => {
    res.json({ message: 'Configuração do sistema. Somente administradores podem acessar', user: req.user });
});

router.get('/reports', authMiddleware, async (req: Request, res:Response) => {
    res.json({ message: 'Relatorios financeiros. Acesso permitido para Administradores e Gestores', user: req.user });
});

export default router;