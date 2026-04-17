import { PrismaClient } from '@prisma/client'
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();     //função
import {attachSave} from "../utils/save.js";
//com esse prisma eu consigo acessar o banco de dados

//Fazer uma função que vai manipular o banco de dados. O CRUD cria
//Post manda 3 parâmetros
//rec - requisição - oque está vindo do frontend
//res - vou responder - de response
//next - de próximo - o que vou fazer a seguir - raramente usa-se no service

/*export function createUser(rec, res, _next){   //eu preciso receber os dados do usuário - parâmetros do post _next (a barrinha é para ignorar)
    prisma.user.create({data});          //Quando eu crio um usuário eu crio ele com os dados dele! Passa a data
    //quando eu criar um usuário, o que eu quero retornar para o usuário, retornar mensagens personalizadas
    return prisma.user.create({data});     
    //vamos para a camada que chama o service!

}*/


const createUserSchema = z.object({
  name: z.string({ 
    required_error: "Por favor, informe o seu nome para continuarmos.", 
    invalid_type_error: "O formato do nome é inválido. Por favor, digite apenas textos." 
  })
  .min(2, { message: "O nome precisa ter no mínimo 2 caracteres." })
  .max(100, { message: "O nome inserido é muito longo. O limite é de 100 caracteres." })
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "O nome deve conter apenas letras e espaços. Não é permitido o uso de números ou símbolos." }),
  
  cpf: z.string({ 
    required_error: "O preenchimento do CPF é obrigatório.",
    invalid_type_error: "O formato do CPF é inválido."
  })
  .length(11, { message: "O CPF deve conter exatamente 11 dígitos numéricos." })
  .regex(/^\d+$/, { message: "O CPF deve conter apenas números, sem pontos (')') ou traços ('-')." }),
  
  email: z.string({ 
    required_error: "O preenchimento do e-mail é obrigatório.",
    invalid_type_error: "O formato do e-mail fornecido é inválido."
  }).email({ message: "O e-mail informado não é válido. Verifique se digitou corretamente (exemplo: nome@dominio.com)." })
    .max(255, { message: "O e-mail inserido excedeu o limite de tamanho aceito pelo sistema." }),
  
  type: z.enum(["ADMIN", "DIRECTOR"], { 
    errorMap: () => ({ message: "O cargo informado é inválido. Selecione uma opção válida: ADMIN ou DIRECTOR." })
  }).optional(),
  
  status: z.enum(["ATIVO", "INATIVO"], {
    errorMap: () => ({ message: "O status informado é inválido. Selecione ATIVO ou INATIVO." })
  }).optional(),
  
  birthDate: z.coerce.date({ 
    errorMap: () => ({ message: "A data de nascimento informada não está num longo formato ou é inválida (exemplo aceito: 2005-05-10T00:00:00.000Z)." })
  }).max(new Date(), { message: "A data de nascimento não pode estar no futuro." }).optional(),
  
  password: z.string({ 
    required_error: "A senha é obrigatória para o cadastro.",
    invalid_type_error: "A senha deve ser um texto."
  }).min(6, { message: "A senha deve ter no mínimo 6 caracteres." })
}).strict({ message: "Foram enviados dados não reconhecidos nesta requisição. Por favor, envie apenas as informações solicitadas no cadastro." });

//async porque mandei a funcao esperar
export async function createUser(req, res, _next){
  try {
    // Trata e valida os dados de entrada usando safeParse
    const parsed = createUserSchema.safeParse(req.body);
    
    // Se a validação falhar, retorna a primeira mensagem de erro amigável encontrada
    if (!parsed.success) {
      const friendlyMessage = parsed.error.issues[0].message;
      return res.status(400).json({ error: friendlyMessage });
    }

    const data = parsed.data;
    
    // Criptografar a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    let u = await prisma.user.create({data});
    return res.status(201).json(u);
  } catch (error) {
    // Prisma conflict error (ex: CPF/Email unicos)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: "Já existe um usuário cadastrado com este mesmo CPF ou e-mail. Por favor, insira dados diferentes." });
    }
    return res.status(500).json({ error: error.message });
  }
}



//async porque mandei a funcao esperar
export async function showUser(req, res, _next){
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Código de identificação (ID) inválido. Por favor, informe apenas números numéricos." });
    }

    let u = await prisma.user.findFirst({where: {id:id}});
    
    if (!u) {
      return res.status(404).json({ error: "Nenhum usuário foi encontrado com o código fornecido. Verifique se você não digitou errado." });
    }
    return res.status(200).json(u);
  } catch (error) {
    return res.status(500).json({ error: "Desculpe, nosso sistema encontrou uma dificuldade técnica. Tente mais tarde." });
  }
}

//async porque mandei a funcao esperar
export async function readUser(req, res, _next) {
  try {
    const { name, status, type, birth_min, birth_max } = req.query;
    const consult = {}; // Objeto para montar a consulta

    // Usando ifs 
    if (name) consult.name = { contains: name };
    if (status) consult.status = status;
    if (type) consult.type = type;

    // Lógica flexível para o aniversário (permite filtrar apenas pelo mínimo, apenas pelo máximo, ou ambos)
    if (birth_min || birth_max) {
      consult.birthDate = {};
      
      if (birth_min) {
        const minDate = new Date(birth_min);
        if (!isNaN(minDate)) consult.birthDate.gte = minDate;
        else return res.status(400).json({ error: "O formato da data inicial informada é inválido." });
      }

      if (birth_max) {
        const maxDate = new Date(birth_max);
        if (!isNaN(maxDate)) consult.birthDate.lte = maxDate;
        else return res.status(400).json({ error: "O formato da data final informada é inválido." });
      }
    }

    // Busca no banco de dados com os filtros montados
    const users = await prisma.user.findMany({
      where: consult
    });

    if (users.length === 0) {
      return res.status(404).json({ error: "Nenhum usuário foi encontrado correspondente aos filtros de busca informados." });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Identificamos um erro de processamento. Por favor, recarregue a página ou tente novamente mais tarde." });
  }
}


const editUserSchema = z.object({
  name: z.string({ invalid_type_error: "O formato do nome é inválido. Por favor, envie dados textuais." })
    .min(2, { message: "A atualização exige que o nome tenha no mínimo 2 caracteres." })
    .max(100, { message: "O nome inserido não pode possuir mais de 100 caracteres." })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "O nome não deve possuir números ou traços especiais. Utilize apenas letras e espaços." })
    .optional(),
  
  email: z.string({ invalid_type_error: "O e-mail deve ser estar formato textual." })
    .email({ message: "O e-mail para atualização parece estar com defeito. (Exemplo aceito: contato@dominio.com)." })
    .max(255, { message: "O tamanho limite aceito para este e-mail é de 255 letras." }).optional(),
    
  type: z.enum(["ADMIN", "DIRECTOR"], { 
    errorMap: () => ({ message: "O cargo escolhido na edição é inexistente. Só possuimos os cargos ADMIN ou DIRECTOR." })
  }).optional(),
  
  status: z.enum(["ATIVO", "INATIVO"], {
    errorMap: () => ({ message: "As opções para a alteração de status são restritas para ATIVO ou INATIVO." })
  }).optional(),
  
  birthDate: z.coerce.date({ 
    errorMap: () => ({ message: "Padrão de edição para data não suportado. Verifique os dados e envie por exemplo 2005-05-10T00:00:00.000Z." })
  }).max(new Date(), { message: "A data de nascimento não pode estar no futuro." }).optional()
}).strict({ message: "Há um ou mais parâmetros sendo enviados que não deveriam estar ai ou não são válidos para alteração (por exemplo: você não pode alterar o CPF desta conta)." });

export async function editUser(req, res, _next) 
{
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "O número de identificação de usuário que você forneceu não é válido." });
    }

    const parsed = editUserSchema.safeParse(req.body);

    if (!parsed.success) {
      const friendlyMessage = parsed.error.issues[0].message;
      return res.status(400).json({ error: friendlyMessage });
    }

    const data = parsed.data;

    let u = await prisma.user.findFirst({ where: { id: id } });

    if(!u){
        return res.status(404).json({ error: "O usuário solicitado para modificação não pôde ser encontrado." });
    }

    u = attachSave(u, 'user');

    if(data.name !== undefined) u.name = data.name;
    if(data.email !== undefined) u.email = data.email;
    if(data.birthDate !== undefined) u.birthDate = data.birthDate;
    if(data.type !== undefined) u.type = data.type;
    if(data.status !== undefined) u.status = data.status;

    await u.save();

    return res.status(202).json(u);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: "Este endereço de e-mail já está sendo utilizado por um cliente no sistema." });
    }
    return res.status(500).json({ error: "Detectamos falha na requisição devido a um erro dos nossos servidores. Tente novamente mais tarde." });
  }
}


export async function deleteUser(req, res, _next) 
{
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Diga um número de indentificador válido para efetuar a remoção." });
    }
   
    let u = await prisma.user.findFirst({ where: { id: id } });

    if(!u){
        return res.status(404).json({ error: "Nenhum usuário foi removido porque o mesmo não pode ser encontrado no banco." });
    }
    
    await prisma.user.delete({where: {id:id}});
    return res.status(200).json({ message: "A operação de remoção desse registro de perfil foi realizada." });
  } catch (error) {
    return res.status(500).json({ error: "Infelizmente esse registro de conta não pôde ser efetuado no momento. Nosso serviço pode estar sofrendo instabilidade." });
  }
}

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." })
});

export async function loginUser(req, res, _next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { email, password } = parsed.data;

    // Busca o usuário pelo e-mail
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    // Compara a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    // Gera o token JWT
    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { 
        sub: user.id, 
        type: user.type, 
        email: user.email, 
        name: user.name 
      }, 
      secret, 
      { expiresIn: '1d' }
    );

    // Retorna o token e dados básicos do usuário
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao processar login." });
  }
}