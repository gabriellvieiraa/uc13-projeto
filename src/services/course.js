import { PrismaClient, Prisma } from "@prisma/client";
import { z } from 'zod';
import { attachSave } from "../utils/save.js";

const prisma = new PrismaClient();

//req: requisição o que está vindo do Frontend

//res: response o que vou responder

//next: proximo o que vou fazer seguir


const courseSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(100, "O nome pode ter no máximo 100 caracteres"),
    description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
    urlImg: z.string().url("A URL da imagem fornecida não é um formato válido"),
    workload: z.number().positive("A carga horária deve ser positiva").optional(),
    ranking: z.number().int().min(1),
    fieldOfStudy: z.string().min(2, "A área de estudo deve ter pelo menos 2 caracteres"),
    companyId: z.number().int().positive()
});

const courseEditSchema = z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().min(10).optional(),
    urlImg: z.string().url("A URL da imagem fornecida não é um formato válido").optional(),
    workload: z.number().positive().optional(),
    ranking: z.number().int().min(1).optional(),
    fieldOfStudy: z.string().min(2).optional(),
    companyId: z.number().int().positive().optional()
});

export async function createCourse(req , res , _next){
    try {
        const data = courseSchema.parse(req.body);
        let c = await prisma.course.create({ data });
        return res.status(201).json(c);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Erro de validação (Regras de negócio)", details: error.errors });
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(409).json({ error: "Conflito: Já existe um curso cadastrado com este nome." });
            }
            if (error.code === 'P2003') {
                return res.status(400).json({ error: "Chave estrangeira: A empresa vinculada (companyId) não existe." });
            }
        }
        return res.status(500).json({ error: "Erro inesperado ao criar curso", details: error.message });
    }
}

export async function readCourse(req ,  res , _next) {
    try {
        const{name,description ,workload_max,workload_min, ranking,ranking_max,ranking_min} =req.query;

        let consult ={}

        if(name) consult.name = {contains: "%"+name+"%"}
        if(description) consult.description = {contains: "%"+description+"%"}

        if(workload_max && workload_min) {
            consult.workload = {
                lt: Number(workload_max),
                gt: Number(workload_min)
            }
        }
        if(ranking) consult.ranking = Number(ranking)
        if(ranking_max) consult.ranking = { ...consult.ranking, lt: Number(ranking_max) }
        if(ranking_min) consult.ranking = { ...consult.ranking, gt: Number(ranking_min) }

        let courses = await prisma.course.findMany({where : consult});
        return res.status(200).json(courses);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(400).json({ error: "Erro na consulta do banco de dados", details: error.message });
        }
        return res.status(500).json({ error: "Erro ao buscar cursos", details: error.message });
    }
}

export async function showCourse(req, res ,_next) {
    try {
        let id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido fornecido" });

        let c = await prisma.course.findFirst({where : {id:id}});
        
        if(!c){
            return res.status(404).json({ error: "Não encontrei o curso especificado (ID: " + id + ")" });
        }
        
        return res.status(200).json(c);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(400).json({ error: "Erro na consulta do banco de dados", details: error.message });
        }
        return res.status(500).json({ error: "Erro ao exibir o curso", details: error.message });
    }
}

export async function editCourse(req , res ,_next) {
    try {
        let id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido fornecido" });

        const data = courseEditSchema.parse(req.body);
        
        let c = await prisma.course.findFirst({where : {id:id}});

        if(!c){
            return res.status(404).json({ error: "Não encontrei curso com o ID: " + id })
        };

        c = attachSave(c,'course')

        if(data.name) c.name = data.name;
        if(data.description) c.description = data.description;
        if(data.workload) c.workload = data.workload;
        if(data.ranking) c.ranking = data.ranking;
        if(data.fieldOfStudy) c.fieldOfStudy = data.fieldOfStudy;
        if(data.companyId) c.companyId = data.companyId;
        if(data.urlImg) c.urlImg = data.urlImg;

        await c.save();

        return res.status(202).json(c);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Erro de validação (Regras de negócio)", details: error.errors });
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(409).json({ error: "Conflito: Já existe um curso cadastrado com este nome." });
            }
            if (error.code === 'P2003') {
                return res.status(400).json({ error: "Chave estrangeira: A empresa vinculada (companyId) não existe." });
            }
            if (error.code === 'P2025') {
                return res.status(404).json({ error: "Registro não encontrado para edição." });
            }
        }
        return res.status(500).json({ error: "Erro ao editar informações do curso", details: error.message });
    }
}
export async function deleteCourse(req , res ,_next) {
    try {
        let id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido fornecido" });

        let c = await prisma.course.findFirst({where : {id:id}});

        if(!c){
            return res.status(404).json({ error: "Não encontrei o curso com o ID: " + id })
        };

        await prisma.course.delete({where : {id:id}});
   
        return res.status(202).json({ message: 'Curso removido com sucesso' });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: "O curso que você tentou deletar não existe ou já foi previamente removido." });
            }
            if (error.code === 'P2003') {
                return res.status(409).json({ error: "Não é possível deletar este curso pois ele possui outras entidades vinculadas a ele." });
            }
        }
        return res.status(500).json({ error: "Erro ao deletar curso", details: error.message });
    }
}
