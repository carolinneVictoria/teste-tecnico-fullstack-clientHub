# Teste Técnico - Desenvolvedor Fullstack Júnior

## Descrição
Desenvolver uma aplicação web para cadastro de Cliente e seus Endereços. 

---

## Requisitos Funcionais 
- O usuário deve ser capaz de criar clientes e vincular um ou mais endereços a ele
- O usuário deve ser capaz de cadastrar e editar endereços usando a API [ViaCEP](https://viacep.com.br/) e obter os dados de endereço automaticamente com base no CEP
- O usuário deve ser capaz de escolher entre cadastrar um cliente que é pessoa física (CPF) ou jurídica (CNPJ)
- O usuário deve ser capaz de editar e excluir um cliente ou seus endereços
- O usuário deve ser capaz de buscar clientes
- O usuário deve ser capaz de realizar busca por nome ou email, e filtrar dados por data

---

## Requisitos Técnicos

### Observações Importantes
- Os requisitos listados abaixo são **obrigatórios**.
- O candidato deve estar preparado para **explicar suas escolhas técnicas** (estrutura, bibliotecas, arquitetura, banco de dados, etc.) e **como essas escolhas foram aplicadas** no projeto.
- O arquivo `readme.md` deve ter o passo a passo para rodar o projeto. Fique a vontade para adicionar prints e gifs explicativos.

---

### Backend
- **Stack**: [Node.js](https://nodejs.org/pt-br) + [Typescript](https://www.typescriptlang.org/) (uso de frameworks como [Express](https://expressjs.com/pt-br/), [Fastify](https://fastify.dev/) é permitido)
- **Banco de dados**: [PostgreSQL](https://www.postgresql.org/) ou [MongoDB](https://www.mongodb.com/) (Uso de ORM como [Prisma](https://www.prisma.io/) é permitido)

#### Banco de Dados (Campos)
**Customer**
- name (obrigatório)  
- email (obrigatório)  
- whatsapp  
- document_type: [CPF/CNPJ] (obrigatório)  
- document_number: (obrigatório) 

**Address**
- cep  
- street  
- neighborhood  
- city  

---

### Frontend
- **Stack**: React + Vite + [Shadcn](https://ui.shadcn.com/)

---

## Uso de Inteligência Artificial (IA)
O uso de ferramentas de **IA** é **permitido**, mas com as seguintes regras:
- **Não é permitido** utilizar IA para **gerar código** ou **copiar soluções prontas**.
- O uso é permitido para:
  - Consultar dúvidas conceituais
  - Pesquisar boas práticas
  - Obter explicações ou comparações de abordagens
- O candidato deve ter **total domínio** sobre as escolhas técnicas realizadas, demonstrando capacidade de explicar:
  - **Por que** optou por determinada solução
  - **Como** ela foi implementada dentro do projeto

---

## Diferenciais (Não obrigatórios)

### Backend
- Organização do código seguindo boas práticas
- Virtualização do ambiente (Docker)
- Uso de **ORM** (Prisma, Sequelize, Mongoose, etc.)

### Frontend
- Uso de **React Hook Form** para gerenciamento de formulários
- Uso de **React Query** para requisições e cache de dados
- UI responsiva e amigável

---

## Entrega

1. O candidato deve **clonar o repositório** fornecido pela empresa.  
2. Após finalizar o desafio, deverá **subir o código em um repositório público** no seu perfil do GitHub.  
3. Enviar o **link do repositório finalizado** para avaliação.  

O repositório deve conter um **README.md** com:
- Passos para rodar o backend
- Passos para rodar o frontend

---

## Critérios de Avaliação
- Cobertura de requisitos funcionais
- Busca e filtros funcionando corretamente
- Organização do código e boas práticas
- Estruturação do projeto
- Clareza na documentação (`README.md`)
- Capacidade de explicar e justificar as escolhas técnicas

---

## Prazo
- Até **5 dias corridos** após receber o desafio. 

Qualquer dúvida, fique à vontade para nos perguntar pelo canal de comunicação da vaga.  
Boa sorte!
