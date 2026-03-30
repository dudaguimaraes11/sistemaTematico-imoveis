import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findAllImoveis() {
    return prisma.imovel.findMany({
        include: { proprietario: true },
    });
}

export async function findImovelById(id) {
    return prisma.imovel.findUnique({
        where: { id: Number(id) },
        include: { proprietario: true },
    });
}

export async function createImovel(data) {
    return prisma.imovel.create({
        data: {
            nome: data.nome,
            descricao: data.descricao  ?? null,
            categoria: data.categoria,
            disponivel: data.disponivel ?? true,
            preco: data.preco,
            foto: data.foto ?? null,
            proprietarioId: Number(data.proprietarioId),
        },
        include: { proprietario: true },
    });
}

export async function updateImovel(id, data) {
    return prisma.imovel.update({
        where: { id: Number(id) },
        data: {
            nome: data.nome,
            descricao: data.descricao,
            categoria: data.categoria,
            disponivel: data.disponivel,
            preco: data.preco,
            foto: data.foto,
            proprietarioId: data.proprietarioId ? Number(data.proprietarioId) : undefined,
        },
        include: { proprietario: true },
    });
}

export async function deleteImovel(id) {
    return prisma.imovel.delete({
        where: { id: Number(id) },
    });
}