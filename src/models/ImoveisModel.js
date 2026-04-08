import prisma from '../utils/prismaClient.js';

const categoriasValidas = ['APARTAMENTO', 'CASA', 'TERRENO', 'COMERCIAL'];

export default class ImoveisModel {
    constructor({
        id,
        nome,
        descricao = null,
        categoria,
        disponivel = true,
        preco,
        foto = null,
        clienteId,
    } = {}) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.disponivel = disponivel;
        this.preco = preco !== undefined ? Number(preco) : undefined;
        this.foto = foto;
        this.clienteId = clienteId ? Number(clienteId) : undefined;
    }

    async validacao(isUpdate = false) {
        if (!isUpdate) {
            if (!this.nome || this.nome.trim().length < 3) {
                throw new Error('O nome deve ter pelo menos 3 caracteres.');
            }
            if (!this.categoria || !categoriasValidas.includes(this.categoria)) {
                throw new Error(`Categoria inválida. Use: ${categoriasValidas.join(', ')}.`);
            }
            if (this.preco === undefined || this.preco === null || isNaN(this.preco)) {
                throw new Error('O campo "preco" é obrigatório e deve ser numérico.');
            }
            if (this.preco < 0) {
                throw new Error('O campo "preco" deve ser um valor positivo.');
            }
            if (!this.clienteId) {
                throw new Error('O campo "clienteId" é obrigatório.');
            }

            const cliente = await prisma.cliente.findUnique({ where: { id: this.clienteId } });
            if (!cliente) throw new Error('Cliente não encontrado.');
            if (!cliente.ativo) throw new Error('Não é permitido cadastrar imóvel para um cliente inativo.');
        } else {
            if (this.categoria && !categoriasValidas.includes(this.categoria)) {
                throw new Error(`Categoria inválida. Use: ${categoriasValidas.join(', ')}.`);
            }
            if (this.preco !== undefined && (isNaN(this.preco) || this.preco < 0)) {
                throw new Error('O campo "preco" deve ser um valor positivo.');
            }
            if (this.clienteId) {
                const cliente = await prisma.cliente.findUnique({ where: { id: this.clienteId } });
                if (!cliente) throw new Error('Cliente não encontrado.');
                if (!cliente.ativo) throw new Error('Não é permitido vincular imóvel a um cliente inativo.');
            }
        }
    }

    async criar() {
        await this.validacao(false);
        return prisma.imoveis.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                disponivel: this.disponivel,
                preco: this.preco,
                foto: this.foto,
                clienteId: this.clienteId,
            },
            include: { cliente: true },
        });
    }

    async atualizar() {
        await this.validacao(true);
        return prisma.imoveis.update({
            where: { id: this.id },
            data: {
                ...(this.nome !== undefined && { nome: this.nome }),
                ...(this.descricao !== undefined && { descricao: this.descricao }),
                ...(this.categoria !== undefined && { categoria: this.categoria }),
                ...(this.disponivel !== undefined && { disponivel: this.disponivel }),
                ...(this.preco !== undefined && { preco: this.preco }),
                ...(this.foto !== undefined && { foto: this.foto }),
                ...(this.clienteId !== undefined && { clienteId: this.clienteId }),
            },
            include: { cliente: true },
        });
    }

    async deletar() {
        return prisma.imoveis.delete({ where: { id: this.id } });
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
        if (filtros.clienteId) {
            where.clienteId = Number(filtros.clienteId);
        }

        return prisma.imoveis.findMany({
            where,
            include: { cliente: true },
        });
    }

    static async buscarPorId(id) {
        const data = await prisma.imoveis.findUnique({
            where: { id: Number(id) },
            include: { cliente: true },
        });

        if (!data) return null;

        return new ImoveisModel(data);
    }
}