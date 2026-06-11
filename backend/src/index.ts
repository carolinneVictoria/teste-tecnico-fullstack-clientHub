// Importações Necessárias
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Rota para verificar se a API ta funcionando
app.get("/api/health", (_req, res) => {
    res.json({ ok: true, message: "API Rodando :)" });
});

// Rota para listar clientes Cadastrados e aplicar filtros de busca e datas, se existirem
app.get("/api/clientes", async (req, res) => {
    try {
        const busca = String(req.query.busca || "").trim();
        const dataInicio = req.query.dataInicio 
        ? new Date(String(req.query.dataInicio)) : null;
        const dataFim = req.query.dataFim 
        ? new Date(String(req.query.dataFim)) : null;

        const clientes = await prisma.cliente.findMany({
            where: {
                AND: [
                    busca
                        ? {
                            OR: [
                                { nome: { contains: busca, mode: "insensitive" } },
                                { email: { contains: busca, mode: "insensitive" } },
                            ],
                        }
                        : {},
                        dataInicio ? { createdAt: { gte: dataInicio } } : {},
                        dataFim ? { createdAt: { lte: dataFim } } : {},
                ],
            },
            include: { enderecos: true },
            orderBy: { createdAt: "desc" },
        });
        res.json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao listar clientes" });
    }
});