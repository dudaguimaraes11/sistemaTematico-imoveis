import prisma from '../utils/prismaClient.js';

export default class ImoveisModel {
    constructor({
        id,
        nome,
        descricao = null,
        categoria,
        disponivel = true,
        preco,
        foto = null,
        proprietarioId,
    } = {}) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.disponivel = disponivel;
        this.preco = preco !== undefined ? Number(preco) : undefined;
        this.foto = foto;
        this.proprietarioId = proprietarioId ? Number(proprietarioId) : undefined;
    }

    async criar() {
        await this.validacao();
        return prisma.imovel.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                disponivel: this.disponivel,
                preco: this.preco,
                foto: this.foto,
                proprietarioId: this.proprietarioId,
            },
            include: { proprietario: true },
        });
    }

    async atualizar() {
        await this.validacao(true);
        return prisma.imovel.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                disponivel: this.disponivel,
                preco: this.preco,
                foto: this.foto,
                proprietarioId: this.proprietarioId,
            },
            include: { proprietario: true },
        });
    }

    async deletar() {
        return prisma.imovel.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }

        if (filtros.categoria) {
            where.categoria = filtros.categoria;
        }

        if (filtros.disponivel !== undefined) {
            where.disponivel = filtros.disponivel === 'true' || filtros.disponivel === true;
        }

        if (filtros.proprietarioId) {
            where.proprietarioId = Number(filtros.proprietarioId);
        }

        return prisma.imovel.findMany({
            where,
            include: { proprietario: true },
        });
    }

    static async buscarPorId(id) {
        const data = await prisma.imovel.findUnique({
            where: { id: Number(id) },
            include: { proprietario: true },
        });

        if (!data) return null;

        return new ImoveisModel(data);
    }
}