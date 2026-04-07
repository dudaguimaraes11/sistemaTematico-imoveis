import prisma from '../utils/prismaClient.js';

export default class ClienteModel {
    constructor({
        id,
        nome,
        email = null,
        cpf = null,
        telefone,
        cep = null,
        logradouro = null,
        bairro = null,
        localidade = null,
        uf = null,
        ativo = true,
    } = {}) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.cpf = cpf ? String(cpf) : null;
        this.telefone = telefone;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = ativo;
    }
    async criar() {
        return prisma.cliente.create({
            data: {
                nome: this.nome,
                email: this.email,
                cpf: this.cpf,
                telefone: this.telefone,
                cep: this.cep,
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },
        });
    }

    async atualizar() {
        return prisma.cliente.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                email: this.email,
                cpf: this.cpf,
                telefone: this.telefone,
                cep: this.cep,
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },
        });
    }

    async deletar() {
        return prisma.cliente.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = {
                contains: filtros.nome,
                mode: 'insensitive'
            };
        }

        if (filtros.cpf) {
            where.cpf = filtros.cpf;
        }

        if (filtros.email) {
            where.email = filtros.email;
        }
        if (filtros.telefone) {
            where.telefone = filtros.telefone;
        }
        if (filtros.localidade) {
            where.localidade = filtros.localidade;
        }


        return prisma.cliente.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.cliente.findUnique({ where: { id } });

        if (!data) return null;

        return new ClienteModel(data);
    }
}