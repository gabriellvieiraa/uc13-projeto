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
    let companies = await prisma.companie.findMany();
    return res.status(200).json(companies)
}