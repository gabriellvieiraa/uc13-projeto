import { PrismaClient } from '@prisma/client'
import { z } from 'zod';
const prisma = new PrismaClient();     //função
import {attachSave} from "../utils/save.js";
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
export async function createUser(req, res, _next){   //eu preciso receber os dados do usuário - parâmetros do post _next (a barrinha é para ignorar)
  const data = req.body; //talvez precisa tratar
  let u = await prisma.user.create({data}); //eu preciso que o banco de dados espere
  return res.status(201).json(u);

}


//async porque mandei a funcao esperar
export async function showUser(req, res, _next){   //eu preciso receber os dados do usuário - parâmetros do post _next (a barrinha é para ignorar)
  let id = Number(req.params.id);
  let u = await prisma.user.findFirst({where: {id:id}});
  return res.status(200).json(u);
}

//async porque mandei a funcao esperar
export async function readUser(req, res, _next) {
  const { name, status, type, birth_min, birth_max } = req.query;
  const consult = {}; // Objeto para montar a consulta

  // Usando ifs 
  if (name) consult.name = { contains: name };
  if (status) consult.status = status;
  if (type) consult.type = type;

  //Lógica de mínimo e máximo para o aniversario
  //Se houver data de início e fim, ele cria um filtro de período.
  //gte: Maior ou igual à data mínima.
  //lte: Menor ou igual à data máxima.
  if (birth_min && birth_max) {
    consult.birthDate = {
      gte: new Date(birth_min),
      lte: new Date(birth_max)
    };
  }

  // Busca no banco de dados com os filtros montados
  const users = await prisma.user.findMany({
    where: consult
  });

  return res.status(200).json(users);
}


export async function editUser(req, res, _next) 
{
  let id = Number(req.params.id);
  const {name, email, birthDate} = req.body; //recuperar todos os campos

  let u = await prisma.user.findFirst({ where: { id: id } });

  if(!u){
      return res.status(404).json("Não encontrei " + id);
  }

  u= attachSave(u, 'user');

  if(name) u.name = name;
  if(email) u.email = email;
  if(birthDate) u.birthDate = birthDate;

  await u.save();

  return res.status(202).json(u);

}