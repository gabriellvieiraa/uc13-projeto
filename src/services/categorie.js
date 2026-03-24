import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { attachSave } from "../utils/save.js"; 
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
    const {name, description} = req.query

    let consult = {}

    if (name) consult.name = {contains: "%"+ name + "%"}
    if (description) consult.description = {contains: "%" + description + "%"}


    let categories = await prisma.category.findMany({where: consult});
    return res.status(200).json(categories);
}

export async function showCategorie(req, res, _next){
    let id = Number(req.params.id);
    let c = await prisma.category.findFirst({where: {id:id} });
    return res.status(200).json(c);
}

export async function editCategorie(req, res, _next){
    const {name, description, urlImg} = req.body
    let id = Number(req.params.id);
    let c = await prisma.category.findFirst({where: {id:id} });

    if(!c){
        return res.status(404).json("Não encontrei "+id)
    }

    c = attachSave(c, 'category');

    if (name) c.name = name;
    if (description) c.description = description;
    if (urlImg) c.urlImg = urlImg;

    await c.save();

    return res.status(202).json(c);
}