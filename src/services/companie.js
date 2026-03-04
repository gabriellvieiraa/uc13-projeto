import { PrismaClient } from "@prisma/client"
import { z } from 'zod'
const prisma = new PrismaClient();

//req: requisição o que esta vindo do frontend
//req: responde o que eu vou responder
//next: proximo o que vou fazer seguir

export async function createCompanie(req, res, _next){
    const data = req.body;
    let u =  await prisma.company.create({data});
    return res.status(201).json(u);
  




}

export async function readCompanie(req, res, _next) {
    let companies = await prisma.company.findMany();
    return res.status(200).json(companies)
}



export async function showCompanie(req, res, _next) {
    let id = Number(req.params.id);
    let c = await prisma.company.findFirst({where: {id:id} });
    return res.status(200).json(c);

    
}