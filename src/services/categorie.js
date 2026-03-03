import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
const prisma = new PrismaClient();

//req: requisição o que esta vindo do frontend
//res: responde o que vou responder
//next: proximo o que vou fazer 

export async function createCategorie(req, res, _next){
    const data = req.body
    let u = await prisma.category.create({data});
    return res.status(201).json(u);

}

export async function readCategorie(req, res, _next){
    let categories = await prisma.categorie.findMany();
    return res.status(200).json(categories);
}