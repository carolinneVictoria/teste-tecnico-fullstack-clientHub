# ClientHub

Sistema de gerenciamento de clientes e endereços desenvolvido como teste técnico Fullstack.

## Objetivo

A aplicação permite o cadastro de clientes (Pessoa Física ou Pessoa Jurídica), gerenciamento de múltiplos endereços por cliente, consulta automática de CEP utilizando o ViaCEP e busca de registros por nome, e-mail ou período de cadastro.

## Tela de Cadastro
<img width="1307" height="656" alt="image" src="https://github.com/user-attachments/assets/6d504520-f414-4dd7-ad37-917f2aef313d" />

## Tela de Listagem de Clientes e Endereços
<img width="1313" height="658" alt="image" src="https://github.com/user-attachments/assets/90cd0e4c-d1de-467e-af80-12625a7785d6" />

## Tecnologias Utilizadas

### Backend

* Node.js
* TypeScript
* Express
* Prisma ORM
* PostgreSQL
* Axios
* Dotenv

### Frontend

* React
* TypeScript
* Vite

## Funcionalidades

* Cadastro, edição e exclusão de clientes
* Cadastro, edição e exclusão de endereços
* Consulta automática de CEP via ViaCEP
* Associação de múltiplos endereços a um cliente
* Busca por nome e e-mail
* Filtro por período de cadastro
* API REST integrada ao banco PostgreSQL
* Responsividade para telas menores
* Light Mode e Dark Mode

## Estrutura do Projeto

```text
teste-tecnico-fullstack/
├── backend/
│   ├── prisma/
│   ├── src/
│   └── .env
├── frontend/
│   ├── src/
│   └── vite.config.ts
└── README.md
```
## Prisma


## Como Executar

### Pré-requisitos

* Node.js (LTS)
* PostgreSQL
* Git

### 1. Clonar o repositório

```bash
git clone https://github.com/carolinneVictoria/teste-tecnico-fullstack-clientHub
```

### 2. Configurar o banco de dados

Crie um banco PostgreSQL e configure a conexão no arquivo `.env` do backend.

Exemplo:

```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/nome_do_banco
PORT=4000
```

### 3. Executar o Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### 4. Executar o Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

## Fluxo da Aplicação

1. O usuário cadastra um cliente.
2. O frontend envia os dados para a API.
3. O backend valida e salva as informações no PostgreSQL.
4. O usuário pode adicionar um ou mais endereços ao cliente.
5. A consulta de CEP é realizada através da integração com o ViaCEP.
6. Os dados são atualizados automaticamente na interface após cada operação.

## Autor

Desenvolvido por Carolinne Victoria.
