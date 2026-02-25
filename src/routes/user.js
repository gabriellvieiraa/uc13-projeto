import { Router } from 'express';

import { createUser } from '../services/user'

const router = Router();
// O create quando ele tá no protocolo http, create e post é a mesma coisa, por isso eu vou fazer uma rota de post. Como todo função ela recebe parâmetro.
// O post vai criar um usuário
router.post('/create' , createUser); //aqui é só a barrinha. Desse jeito fica mais simples, todos os erros ficam num arquivo só

export default router; //perguntar se devo colocar