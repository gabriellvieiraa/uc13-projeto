import { Router } from 'express';

import { createUser, showUser, readUser, editUser, deleteUser, loginUser } from '../services/user.js';
import authMiddleware from '../middlewares/auth.js';
import { isAdmin, isSelfOrAdmin, canCreateUser, optionalAuth } from '../middlewares/roles.js';

const router = Router();
// O create quando ele tá no protocolo http, create e post é a mesma coisa, por isso eu vou fazer uma rota de post. Como todo função ela recebe parâmetro.
// O post vai criar um usuário
router.post('/' , optionalAuth, canCreateUser, createUser); //aqui é só a barrinha. Desse jeito fica mais simples, todos os erros ficam num arquivo só
router.post('/login', loginUser);
router.get('/' , authMiddleware, isAdmin, readUser); //aqui é só a barrinha. Desse jeito fica mais simples, todos os erros ficam num arquivo só
router.get('/:id' , authMiddleware, isSelfOrAdmin, showUser); //aqui é só a barrinha. Desse jeito fica mais simples, todos os erros ficam num arquivo só
router.put('/:id', authMiddleware, isSelfOrAdmin, editUser);
router.delete('/:id', authMiddleware, isAdmin, deleteUser);

export default router; //perguntar se devo colocar

