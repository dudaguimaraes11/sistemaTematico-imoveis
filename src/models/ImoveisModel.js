import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function buscarTodos(filtros = {}) {
    const where = {};

    if (filtros.nome) {
        where.nome = { contains: filtros.nome, mode: "insensitive" };
    }
    if (filtros.categoria) {
        where.categoria = filtros.categoria;
    }
    if (filtros.disponivel !== undefined) {
        where.disponivel = filtros.disponivel === "true";
    }

    return prisma.imovel.findMany({
        where,
        include: { proprietario: true },
    });
}

export async function buscarPorId(id) {
    return prisma.imovel.findUnique({
        where: { id: Number(id) },
        include: { proprietario: true },
    });
}

export async function criar(dados) {
    return prisma.imovel.create({
        data: {
            nome: dados.nome,
            descricao: dados.descricao ?? null,
            categoria: dados.categoria,
            disponivel: dados.disponivel,
            preco: Number(dados.preco),
            foto: data.foto ?? null,
            proprietarioId: Number(dados.proprietarioId),
        },
        include: { proprietario: true },
    });
}

export async function atualizar(id, data) {
    return prisma.imovel.update({
        where: { id: Number(id) },
        data: {
            nome: data.nome,
            descricao: data.descricao,
            categoria: data.categoria,
            disponivel: data.disponivel,
            preco: data.preco !== undefined ? Number(data.preco) : undefined,
            foto: data.foto,
            proprietarioId: data.proprietarioId ? Number(data.proprietarioId) : undefined,
        },
        include: { proprietario: true },
    });
}

export async function excluir(id) {
    return prisma.imovel.delete({
        where: { id: Number(id) },
    });
}