import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // O token geralmente vem no header Authorization no formato: "Bearer TOKEN"
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Divide o "Bearer" do token em si
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no token' });
  }

  const [scheme, token] = parts;

  // Verifica se o scheme está escrito "Bearer"
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  // Verifica a validade do token usando a chave secreta
  // A chave secreta deve estar no seu arquivo .env (ex: JWT_SECRET=sua_chave_aqui)
  
  try{
  const secret = process.env.JWT_SECRET; 

  const payload = jwt.verify(token, secret) 
    // Se o token for válido, salva as informações decodificadas do usuário (como o ID) no req
    // para que as próximas funções (rotas) possam usar
    req.logeded = {
      id: payload.sub,
      type: payload.type,
      email: payload.email,
      name: payload.name
    }; 
    return next();
  }catch(e){
    return res.status(401).json({ error: e.message });
  };

    // Chama o next() para continuar a execução da rota
};

export default authMiddleware;
