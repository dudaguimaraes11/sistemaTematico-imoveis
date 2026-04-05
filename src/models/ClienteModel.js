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

    async validacao(isUpdate = false) {
        if (!this.nome || this.nome.length < 3 || this.nome.length > 100) {
            throw new Error('O nome deve ter entre 3 e 100 caracteres.');
        }

        if (!this.cpf || !/^\d{11}$/.test(this.cpf)) {
            throw new Error('CPF deve conter exatamente 11 dígitos numéricos.');
        }

        const cpfExistente = await prisma.cliente.findFirst({
            where: {
                cpf: this.cpf,
                ...(isUpdate && { id: { not: this.id } }),
            },
        });

        if (cpfExistente) {
            throw new Error('CPF já cadastrado.');
        }

        if (this.cep && !/^\d{8}$/.test(this.cep)) {
            throw new Error('CEP deve conter exatamente 8 dígitos numéricos.');
        }

        if (this.email && !/^\S+@\S+\.\S+$/.test(this.email)) {
            throw new Error('Email deve ser válido.');
        }

        if (this.email) {
            const emailExistente = await prisma.cliente.findFirst({
                where: {
                    email: this.email,
                    ...(isUpdate && { id: { not: this.id } }),
                },
            });

            if (emailExistente) {
                throw new Error('Este email já foi cadastrado.');
            }
        }
    }
    async criar() {
        await this.validacao();
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
        await this.validacao(true);
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