# Contexto do Projeto (uc13-projeto)

Este documento descreve a arquitetura, as tecnologias e as regras de negócio identificadas no projeto.

## 1. Visão Geral
O projeto é uma API backend desenvolvida em Node.js. Ele tem o objetivo de gerenciar **Empresas**, **Usuários**, **Cursos** e **Categorias**, criando uma plataforma que conecta esses domínios. A aplicação fornece rotas para operações relacionadas a cada uma dessas entidades, possivelmente voltada para educação corporativa ou gestão de talentos.

## 2. Stack Tecnológica
A aplicação utiliza um ecossistema moderno em Node.js focado em performance, segurança e tipagem de banco de dados.

- **Framework Web**: `express` (v5)
- **ORM (Mapeamento Objeto-Relacional)**: `prisma`
- **Banco de Dados**: PostgreSQL (definido no `schema.prisma`)
- **Validação de Dados**: `zod`
- **Autenticação & Segurança**: 
  - `jsonwebtoken` para geração e verificação de tokens JWT.
  - `bcryptjs` para hashing de senhas.
  - `cors` para controle de acesso cross-origin, permitindo integração com o frontend.
- **Ambiente de Desenvolvimento**: 
  - `nodemon` para restart automático.
  - `vitest` configurado para testes (via script de teste).
  - `dotenv` para variáveis de ambiente.

## 3. Entidades Principais e Relacionamentos (Banco de Dados)

O modelo de dados foi estruturado com Prisma e é composto pelas seguintes tabelas principais:

### User (Usuário)
Representa as pessoas que interagem no sistema.
- **Tipos de Usuário (UserType)**: `ADMIN` ou `DIRECTOR`.
- **Status (UserStatus)**: `ATIVO` ou `INATIVO`.
- **Campos**: Nome, CPF (único), Email (único), Data de Nascimento, Senha.
- **Relacionamentos**:
  - Pode pertencer a uma **Company** (Empresa).
  - Pode ser "Dono" (owner) de **Companies** e de **Courses**.
  - Possui interesses ou relacionamentos com **Categories** (Categorias).

### Company (Empresa)
Representa as organizações cadastradas.
- **Campos**: Nome (único), CNPJ (único), Fundação, Locais de atuação (places), Fundamentos, Métodos e Ranking.
- **Relacionamentos**:
  - Possui vários **Users** (colaboradores/membros).
  - Possui vários **Courses** (cursos oferecidos pela empresa).
  - Possui um **User** como Dono (owner).

### Course (Curso)
Cursos de capacitação/estudo geridos pelas empresas ou usuários.
- **Campos**: Nome, Descrição, URL da Imagem, Carga Horária, Ranking e Área de Estudo (fieldOfStudy).
- **Relacionamentos**:
  - Pertence a uma **Company**.
  - Pertence a várias **Categories**.
  - Possui um **User** como Dono (owner).

### Category (Categoria)
Utilizada para classificar ou agrupar os Cursos e os perfis dos Usuários.
- **Campos**: Nome (único) e Descrição.
- **Relacionamentos**:
  - Relacionada a vários **Courses**.
  - Relacionada a vários **Users**.

## 4. Estrutura do Projeto (src)
A arquitetura do projeto (baseada na pasta `src/`) indica um padrão bem organizado e componentizado:

- `/src/routes/`: Contém os roteadores Express para cada domínio da aplicação (`user.js`, `companie.js`, `course.js`, `categorie.js`).
- `/src/server.js`: Ponto de entrada do Express, configuração dos middlewares (`cors`, `express.json`) e injeção das rotas.
- `/src/middlewares/`: Provavelmente guarda middlewares de autenticação, validação de tokens JWT e verificação de erros.
- `/src/services/`: Lógica de negócio, interagindo com o Prisma Client e aplicando validações do Zod.
- `/src/utils/`: Funções utilitárias (ex: conversões, formatação).
- `/src/seed.js`: Script de seed de banco de dados para popular a aplicação inicialmente.

## 5. Scripts de NPM
- `npm run dev`: Inicia o servidor com Nodemon (`src/server.js`).
- `npm start`: Roda as migrações no banco e inicia o servidor com Node.
- `npm run migrate`: Roda migrações de dev no banco.
- `npm run seed`: Popula o banco com os dados do arquivo `seed.js`.
- `npm run test`: Executa os testes unitários utilizando o Vitest.

## 6. Frontend
A aplicação conta também com uma interface frontend para consumir a API.
- **Ecossistema:** Vite, React e JavaScript.
- **Estilização:** CSS puro (Vanilla CSS) com foco em designs premium, modernos e dinâmicos (animações, glassmorphism e cores ricas).
- **Integração:** Consome a API do backend através do `axios` ou `fetch` e utiliza `react-router-dom` para navegação.
