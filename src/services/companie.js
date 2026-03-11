    import { PrismaClient } from "@prisma/client"
    import { z } from 'zod'
    import { attachSave } from "./utils/save.js";
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
    const {name, cnpj, foundation, places, fundaments, methods} = req.body


        let consult = {}

    if (name) consult.name = {contains: "%"+ name + "%"}
    if (cnpj) consult.cnpj = {contains: "%"+ cnpj + "%"}
    if (foundation) consult.foundation = {contains: "%" + foundation + "%"}
    if (places) consult.places = {contains: "%" + places + "%"}
    if (fundaments) consult.fundaments = {contains: "%" + fundaments + "%"}
    if (methods) consult.methods = {contains: "%" + methods + "%"}

    let companie = await prisma.company.findMany({where: consult});
    return res.status(200).json(companie);

}

export async function showCompanie(req, res, _next) {
    let id = Number(req.params.id);
    let c = await prisma.company.findFirst({where: {id:id} });
    return res.status(200).json(c);

}


  export async function editCompanie(req, res, _next) {
    const {name, cnpj, foundation, places, fundaments, methods} = req.body
    let id = Number(req.params.id);
    let c = await prisma.company.findFirst({where: {id:id} });

    if (name) c.name = name 
    if (places) c.places = places 
    if (fundaments) c.fundaments = fundaments 
    if (methods) c.methods = methods 

    if(!u){

        return res.status(404).json("Não encontrei "+id)
    }

    u = attachSave(u, 'companie');

    await u.save();

    return res.status(202).json(c);


        
}



