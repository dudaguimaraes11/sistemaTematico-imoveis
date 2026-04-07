import ClienteModel from '../models/ClienteModel.js';
import prisma from '../utils/prismaClient.js';
import buscarEnderecoPorCep from '../utils/viaCep.js';

const validarDadosCliente = async ({
    id = null,
    nome,
    email,
    cpf,
    telefone,
    cep,
    ativo,
    isUpdate = false,
}) => {
    if (!nome || nome.length < 3 || nome.length > 100) {
        throw new Error('O nome deve ter entre 3 e 100 caracteres.');
    }

    if (!cpf || !/^\d{11}$/.test(String(cpf))) {
        throw new Error('CPF deve conter exatamente 11 dígitos numéricos.');
    }

    if (!isUpdate && !telefone) {
        throw new Error('O campo "telefone" é obrigatório!');
    }

    if (!isUpdate && !cep) {
        throw new Error('O campo "cep" é obrigatório!');
    }

    if (cep && !/^\d{8}$/.test(String(cep))) {
        throw new Error('CEP deve conter exatamente 8 dígitos numéricos.');
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error('Email deve ser válido.');
    }

    if (ativo !== undefined && typeof ativo !== 'boolean') {
        throw new Error('O campo "ativo" deve ser booleano.');
    }

    const cpfExistente = await prisma.cliente.findFirst({
        where: {
            cpf: String(cpf),
            ...(isUpdate && id ? { id: { not: id } } : {}),
        },
    });

    if (cpfExistente) {
        throw new Error('CPF já cadastrado.');
    }

    if (email) {
        const emailExistente = await prisma.cliente.findFirst({
            where: {
                email,
                ...(isUpdate && id ? { id: { not: id } } : {}),
            },
        });

        if (emailExistente) {
            throw new Error('Este email já foi cadastrado.');
        }
    }
};

 
export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, email, telefone, cpf, cep, ativo } =
            req.body;

        if (!nome) {
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }

        if (!email) {
            return res.status(400).json({ error: 'O campo "email" é obrigatório!' });
        }

        if (!cpf) {
            return res.status(400).json({ error: 'O campo "cpf" é obrigatório!' });
        }

        if (!telefone) {
            return res.status(400).json({ error: 'O campo "telefone" é obrigatório!' });
        }

        if (!cep) {
            return res.status(400).json({ error: 'O campo "cep" é obrigatório!' });
        }

        await validarDadosCliente({ nome, email, telefone, cpf, cep, ativo });

        const endereco = await buscarEnderecoPorCep(cep);

        if (!endereco) {
            return res.status(400).json({ error: 'CEP inválido ou não encontrado.' });
        }


            const cliente = new ClienteModel({
                nome,
                telefone,
                email,
                cpf,
                cep,
                logradouro: endereco?.logradouro || null,
                bairro: endereco?.bairro || null,
                localidade: endereco?.localidade || null,
                uf: endereco?.uf || null,
                ativo: ativo ?? true,
            });

            const data = await cliente.criar();

            return res.status(201).json(data);


        } catch (error) {

        console.error('Erro ao detectado:', error.message);
        return res.status(500).json({ erro: error.message });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await ClienteModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum cliente encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res
                .status(400)
                .json({ error: 'O ID enviado não é um número válido.' });
        }

        const cliente = await ClienteModel.buscarPorId(id);

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        return res.status(200).json({ data: cliente });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registro de cliente.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id) ) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const clienteExistente = await ClienteModel.buscarPorId(id);

        if (!clienteExistente) {
            return res.status(404).json({ error: 'Cliente não encontrado para atualizar.' });
        }

        if (!clienteExistente.ativo) {
            return res.status(403).json({ error: 'Não é permitido atualizar um cliente inativo.' });
        }

        const { nome, email, telefone, cpf, cep, ativo } = req.body;

        await validarDadosCliente({
            id,
            nome: nome || clienteExistente.nome,
            email: email || clienteExistente.email,
            cpf: cpf ? String(cpf) : clienteExistente.cpf,
            telefone: telefone || clienteExistente.telefone,
            cep: cep || clienteExistente.cep,
            ativo: ativo !== undefined ? ativo : clienteExistente.ativo,
            isUpdate: true,
        });

        let endereco = null;

        if (cep) {
            endereco = await buscarEnderecoPorCep(cep);

            if (!endereco) {
                return res.status(400).json({ error: 'CEP inválido ou não encontrado.' });
            }
        }

        const cliente = new ClienteModel({  
            id,
            nome: nome || clienteExistente.nome,
            email: email || clienteExistente.email,
            telefone: telefone || clienteExistente.telefone,
            cpf: cpf ? String(cpf) : clienteExistente.cpf,
            cep: cep || clienteExistente.cep,
            logradouro: endereco?.logradouro || clienteExistente.logradouro || null,
            bairro: endereco?.bairro || clienteExistente.bairro || null,
            localidade: endereco?.localidade || clienteExistente.localidade || null,
            uf: endereco?.uf || clienteExistente.uf || null,
            ativo: ativo !== undefined ? ativo : clienteExistente.ativo,
        });
        
        const data = await cliente.atualizar();

        if(!data) return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });

        return res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(400).json({ error: error.message });
    }   
}

export const deletar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const cliente = await ClienteModel.buscarPorId(id);

        if (!cliente) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        if (!cliente.ativo) {
            return res.status(403).json({ error: 'Não é permitido deletar um cliente inativo.' });
        }

        await cliente.deletar();

        return res.status(200).json({
            message: `O registro "${cliente.nome}" foi deletado com sucesso!`,
            deletado: cliente,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
    