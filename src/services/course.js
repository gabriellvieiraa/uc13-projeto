import {PrismaClient} from "@prisma/client";
import { z } from 'zod';

const prisma = new PrismaClient();

//req: requisição o que está vindo do Frontend

//res: response o que vou responder

//next: proximo o que vou fazer seguir


export  async function createCourse(req , res , _next){  /// _ DIZ O QUE NÃO VAMOS ULTILIZAR.

    const data =req.body 
    let  c =  await prisma.course.create({data});

    return res.status(201).json(c);

}

export async function readCourse(req ,  res , _next) {
    const{name,description ,workload_max,workload_min, ranking,ranking_max,ranking_min} =req.query;

    let consult ={}

    if(name) consult.name = {contains: "%"+name+"%"}
    if(description) consult.description = {contains: "%"+description+"%"}

    if(workload_max && workload_min)
        consult.workload={
            lt: Number(workload_max),
            gt: Number(workload_min)
        }
    if(ranking) consult.ranking=Number(ranking)
    if(ranking_max) consult.ranking={lt: Number(ranking_max)}
    if(ranking_min) consult.ranking={gt: Number(ranking_min)}




    let courses = await prisma.course.findMany({where : consult});
    return res.status(200).json(courses);
    

}

export async function showCourse(req, res ,_next) {
    let id = Number(req.params.id);
    let c =await prisma.course.findFirst({where : {id:id}});
    return res.status(200).json(c);
    
}
