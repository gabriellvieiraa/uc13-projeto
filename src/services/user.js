import { PrismaClient } from '@prisma/client'
import { z } from 'zod';
const prisma = new PrismaClient();     //função
//com esse prisma eu consigo acessar o banco de dados

//Fazer uma função que vai manipular o banco de dados. O CRUD cria
//Post manda 3 parâmetros
//rec - requisição - oque está vindo do frontend
//res - vou responder - de response
//next - de próximo - o que vou fazer a seguir - raramente usa-se no service

/*export function createUser(rec, res, _next){   //eu preciso receber os dados do usuário - parâmetros do post _next (a barrinha é para ignorar)
    prisma.user.create({data});          //Quando eu crio um usuário eu crio ele com os dados dele! Passa a data
    //quando eu criar um usuário, o que eu quero retornar para o usuário, retornar mensagens personalizadas
    return prisma.user.create({data});     
    //vamos para a camada que chama o service!

}*/

//async porque mandei a funcao esperar
export async function createUser(rec, res, _next){   //eu preciso receber os dados do usuário - parâmetros do post _next (a barrinha é para ignorar)
  const data = req.body; //talvez precisa tratar
  let u = await prisma.user.create({data}); //eu preciso que o banco de dados espere
  return res.status(201).json(u);
  

}