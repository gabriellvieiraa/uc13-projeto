import { PrismaClient } from "@prisma/client"
import { z } from 'zod'
import { attachSave } from "../utils/save.js";
const prisma = new PrismaClient();


function isValidCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (/^(\d)\1+$/.test(cnpj)) return false;

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) return false;

    return true;
}

const createCompanySchema = z.object({
    name: z.string().min(1, "O nome é obrigatório").trim().toUpperCase(),
    cnpj: z.string().transform(v => v.replace(/[^\d]+/g, '')).refine(isValidCNPJ, { message: "CNPJ inválido. Verifique os dígitos numéricos." }),
    foundation: z.string()
        .datetime({ message: "A data de fundação deve estar no formato ISO-8601 (ex: 2023-01-01T00:00:00.000Z)" })
        .refine((data) => {
            const date = new Date(data);
            const year = date.getFullYear();
            const currentYear = new Date().getFullYear();
            return year >= 1500 && year <= currentYear && date <= new Date();
        }, { message: "A data inserida é incoerente (ano irreal) ou está no futuro." }),
    places: z.string().min(1, "O local é obrigatório").trim().toUpperCase(),
    fundaments: z.string().min(1, "Os fundamentos são obrigatórios").trim().toUpperCase(),
    methods: z.string().min(1, "Os métodos são obrigatórios").trim().toUpperCase()
});

const updateCompanySchema = z.object({
    name: z.string().min(1, "O nome não pode ser vazio").trim().toUpperCase().optional(),
    places: z.string().min(1, "O local não pode ser vazio").trim().toUpperCase().optional(),
    fundaments: z.string().min(1, "Os fundamentos não podem ser vazios").trim().toUpperCase().optional(),
    methods: z.string().min(1, "Os métodos não podem ser vazios").trim().toUpperCase().optional()
}).refine(data => Object.keys(data).length > 0, {
    message: "Nenhum campo válido para atualização foi fornecido. O corpo deve conter alterações."
});

//req: requisição o que esta vindo do frontend
//res: responde o que eu vou responder
//next: proximo o que vou fazer seguir

export async function createCompanie(req, res, _next) {
    try {
        const user = req.logeded;
        if (!user || (user.type !== 'ADMIN' && user.type !== 'DIRECTOR')) {
            return res.status(403).json({ error: "Acesso Negado: Apenas Administradores e Diretores podem criar empresas." });
        }

        const data = createCompanySchema.parse(req.body);

        const existingCompany = await prisma.company.findFirst({
            where: {
                OR: [
                    { name: data.name },
                    { cnpj: data.cnpj }
                ]
            }
        });

        if (existingCompany) {
            return res.status(409).json({ error: "Já existe uma empresa cadastrada com este nome ou CNPJ." });
        }


        const ownerId = req.logeded.id;
        data.ownerId = ownerId;

        let u = await prisma.company.create({ data });

        // Vincula automaticamente o usuário (diretor) à nova companhia
        if (user.type === 'DIRECTOR') {
            await prisma.user.update({
                where: { id: user.id },
                data: { companyId: u.id }
            });
        }

        return res.status(201).json(u);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Erro de validação dos dados", details: error.errors });
        }
        return res.status(500).json({ error: "Erro interno do servidor ao criar empresa." });
    }
}

export async function readCompanie(req, res, _next) {
    try {
        const { name, cnpj, places, fundaments, methods } = req.query; // agora lê da URL (GET) adequadamente
        let consult = {};

        if (name) consult.name = { contains: name.trim().toUpperCase() };
        if (cnpj) consult.cnpj = { contains: cnpj.replace(/[^\d]+/g, '') }; // ignora máscara na busca
        if (places) consult.places = { contains: places.trim().toUpperCase() };
        if (fundaments) consult.fundaments = { contains: fundaments.trim().toUpperCase() };
        if (methods) consult.methods = { contains: methods.trim().toUpperCase() };

        // Observação: foundation foi removido da consulta com contains porque Prisma
        // não suporta o operador 'contains' para campos DateTime.

        let companie = await prisma.company.findMany({ where: consult });
        return res.status(200).json(companie);
    } catch (error) {
        return res.status(500).json({ error: "Erro interno do servidor ao buscar empresas." });
    }
}

export async function showCompanie(req, res, _next) {
    try {
        let id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: "O ID fornecido é inválido. Tem que ser um número positivo." });
        }

        let c = await prisma.company.findFirst({ where: { id: id } });

        if (!c) {
            return res.status(404).json({ error: `Empresa com ID ${id} não localizada.` });
        }

        return res.status(200).json(c);
    } catch (error) {
        return res.status(500).json({ error: "Erro interno do servidor ao buscar detalhes da empresa." });
    }
}

export async function editCompanie(req, res, _next) {
    try {
        const user = req.logeded;
        if (!user) return res.status(401).json({ error: "Você precisa estar logado." });

        let id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: "O ID fornecido é inválido." });
        }

        const data = updateCompanySchema.parse(req.body); // Lançará um ZodError 400 se não passar nada

        let c = await prisma.company.findFirst({ where: { id: id } });

        if (!c) {
            return res.status(404).json({ error: `Empresa com ID ${id} não localizada.` });
        }

        if (user.type === 'DIRECTOR') {
            if (c.ownerId !== user.id) {
                return res.status(403).json({ error: "Acesso Negado: Você só pode modificar as empresas em que é dono (criador)." });
            }
        } else if (user.type !== 'ADMIN') {
            return res.status(403).json({ error: "Acesso Negado: Apenas Administradores e o Diretor dono podem editar empresas." });
        }

        if (data.name && data.name !== c.name) {
            const nameExists = await prisma.company.findUnique({ where: { name: data.name } });
            if (nameExists) {
                return res.status(409).json({ error: "Já existe uma empresa diferente registrada com esse nome." });
            }
        }

        c = attachSave(c, 'company');

        if (data.name) c.name = data.name;
        if (data.places) c.places = data.places;
        if (data.fundaments) c.fundaments = data.fundaments;
        if (data.methods) c.methods = data.methods;

        await c.save();

        return res.status(202).json(c);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Erro de validação dos dados", details: error.errors });
        }
        return res.status(500).json({ error: "Erro interno do servidor ao editar empresa." });
    }
}

export async function deleteCompanie(req, res, _next) {
    try {
        const user = req.logeded;
        if (!user) return res.status(401).json({ error: "Você precisa estar logado." });

        let id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: "O ID fornecido é inválido." });
        }

        let c = await prisma.company.findFirst({ where: { id: id } });

        if (!c) {
            return res.status(404).json({ error: `Empresa com ID ${id} não localizada.` });
        }

        if (user.type === 'DIRECTOR') {
            if (c.ownerId !== user.id) {
                return res.status(403).json({ error: "Acesso Negado: Você só pode excluir as empresas em que é dono (criador)." });
            }
        } else if (user.type !== 'ADMIN') {
            return res.status(403).json({ error: "Acesso Negado: Apenas Administradores e o Diretor dono podem deletar empresas." });
        }

        await prisma.company.delete({ where: { id: id } });
        return res.status(200).json({ message: "Empresa deletada com sucesso." });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno do servidor ao deletar empresa." });
    }
}

