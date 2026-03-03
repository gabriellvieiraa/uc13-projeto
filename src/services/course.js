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
    let courses = await prisma.course.findMany();
    return res.status(200).json(courses);
    
}

