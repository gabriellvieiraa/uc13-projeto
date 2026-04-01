import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { attachSave } from "../utils/save.js"; 
const prisma = new PrismaClient();

//req: requisição o que esta vindo do frontend
//res: responde o que vou responder
//next: proximo o que vou fazer 

// Schema Simples
const categorySchema = z.object({
    name: z.string({ 
        required_error: "Nome é obrigatório",
    }).min(3, "Nome deve ter no mínimo 3 caracteres"),
    
    description: z.string({
        invalid_type_error: "A descrição deve ser um texto"
    }).min(3, "A descrição deve ser um texto").optional()
});

export async function createCategorie(req, res, _next){
    try {
        const validation = categorySchema.safeParse(req.body);
        
        // Exceção: Dados inválidos
        if (!validation.success) {
            // Entrega TODAS as mensagens (nome e descrição se houverem ambas) juntas:
            const mensagens = validation.errors.map(err => err.message).join(" e ");
            return res.status(400).json({ error: mensagens });
        }

        const data = validation.data;

        // O banco de dados (Prisma) OBRIGA que 'urlImg' e 'description' existam. 
        // Como tiramos isso da requisição HTTP, preenchemos com vazio automaticamente para não dar erro:
        data.urlImg = "";
        if (!data.description) data.description = "";

        // Regra: Nome não pode ser igual a um existente
        const categoryExists = await prisma.category.findFirst({ where: { name: data.name } });
        if (categoryExists) {
            return res.status(400).json({ error: "Já existe uma categoria com este nome." });
        }

        let c = await prisma.category.create({ data });
        return res.status(201).json(c);
    } catch (error) {
        console.error("DEBUG CRIAR CATEGORIA:", error);
        return res.status(500).json({ error: "Erro interno ao criar categoria." });
    }
}

export async function readCategorie(req, res, _next){
    try {
        const {name, description} = req.query;

        let consult = {};

        if (name) consult.name = {contains: name};
        if (description) consult.description = {contains: description};

        let categories = await prisma.category.findMany({where: consult});
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ error: "Erro interno ao buscar categorias." });
    }
}

export async function showCategorie(req, res, _next){
    try {
        let id = Number(req.params.id);
        
        // Exceção: ID inválido
        if (isNaN(id)) {
            return res.status(400).json({ error: "O ID informado não é válido." });
        }

        let c = await prisma.category.findFirst({where: {id:id} });
        
        // Exceção: Não encontrado
        if (!c) {
            return res.status(404).json({ error: "Nenhuma categoria encontrada com este ID." });
        }
        
        return res.status(200).json(c);
    } catch (error) {
        return res.status(500).json({ error: "Erro interno ao exibir categoria." });
    }
}

export async function editCategorie(req, res, _next){
    try {
        let id = Number(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ error: "O ID informado não é válido." });
        }

        const validation = categorySchema.safeParse(req.body);
        if (!validation.success) {
            // Entrega TODAS as mensagens juntas:
            const mensagens = validation.error.errors.map(err => err.message).join(" e ");
            return res.status(400).json({ error: mensagens });
        }

        const data = validation.data;
        if (!data.description) data.description = "";

        let c = await prisma.category.findFirst({where: {id:id} }); 

        if(!c){
            return res.status(404).json({ error: "Nenhuma categoria encontrada com este ID." });
        }

        // Regra: Impede de trocar o nome para o de outra categoria existente
        if (data.name && data.name !== c.name) {
            const categoryExists = await prisma.category.findFirst({ where: { name: data.name } });
            if (categoryExists) {
                return res.status(400).json({ error: "Já existe outra categoria com este nome." });
            }
        }

        c = attachSave(c, 'category');

        if (data.name !== undefined) c.name = data.name;
        if (data.description !== undefined) c.description = data.description;

        await c.save();

        return res.status(202).json(c);
    } catch (error) {
        console.error("DEBUG EDITAR CATEGORIA:", error);
        return res.status(500).json({ error: "Erro interno ao atualizar categoria." });
    }
}

export async function deleteCategorie(req, res, _next ){
    try {
        let id = Number(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ error: "O ID informado não é válido." });
        }

        let c = await prisma.category.findFirst({where: {id:id} })
        
        if(!c){
            return res.status(404).json({ error: "Nenhuma categoria encontrada com este ID." });
        }
        
        let d = await prisma.category.delete({where: {id:id} })
        
        return res.status(202).json({ message: "Removido com sucesso", category: d });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno ao deletar categoria." });
    }
}