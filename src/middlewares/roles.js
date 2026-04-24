import jwt from 'jsonwebtoken';

// Middleware para verificar se é Admin
export const isAdmin = (req, res, next) => {
    if (req.logeded && req.logeded.type === 'ADMIN') {
        return next();
    }
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
};

// Middleware para verificar se o usuário pode acessar/editar o próprio recurso (ou se é admin)
export const isSelfOrAdmin = (req, res, next) => {
    const requestedId = Number(req.params.id);
    
    if (req.logeded && req.logeded.type === 'ADMIN') {
        return next();
    }

    if (req.logeded && req.logeded.type === 'DIRECTOR' && req.logeded.id === requestedId) {
        return next();
    }

    return res.status(403).json({ error: 'Acesso negado. Diretores só podem acessar ou modificar seus próprios dados.' });
};

// Middleware opcional de autenticação para a rota de criação (para permitir o registro)
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(); // Não tem token, continua como não logado (registro)
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) return next();

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) return next();

    try {
        const secret = process.env.JWT_SECRET || 'secret';
        const payload = jwt.verify(token, secret);
        req.logeded = {
            id: payload.sub,
            type: payload.type,
            email: payload.email,
            name: payload.name
        };
    } catch (e) {
        // Ignora erro de token no optional auth e trata como não logado
    }
    return next();
};

// Middleware para verificar se pode criar usuário
export const canCreateUser = (req, res, next) => {
    // Se o usuário já está logado
    if (req.logeded) {
        if (req.logeded.type === 'ADMIN') {
            return next(); // Admin pode criar qualquer um
        }
        if (req.logeded.type === 'DIRECTOR') {
            // Diretor logado não pode criar outros usuários, pois eles já se criaram (já têm conta)
            return res.status(403).json({ error: 'Acesso negado. Diretores não têm permissão para criar outros usuários.' });
        }
    }
    
    // Se não está logado, é um novo usuário se registrando (criando a si mesmo)
    return next();
};
