import ClienteModel from '../models/ClienteModel.js';
import buscarEnderecoPorCep from '../utils/viaCep.js';

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
        if (ativo === undefined) {
            return res.status(400).json({ error: 'O campo "ativo" é obrigatório!' });
        }
        let endereco = {};

        if (cep) {

            if (!/^\d{8}$/.test(cep)) {
                return res
                    .status(400)
                    .json({ error: 'CEP deve conter 8 dígitos numéricos.' });
            }

            endereco = await buscarEnderecoPorCep(cep);

            if (!endereco) {
                return res.status(400).json({ error: 'CEP inválido ou não encontrado.' });
            }
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
        return res.status(400).json({ erro: error.message });
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
        const { id } = req.params;

        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: 'O ID enviado não é um número válido.' });
        }

        const cliente = await ClienteModel.buscarPorId(parseInt(id));

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
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const cliente = await ClienteModel.buscarPorId(parseInt(id));

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            cliente.nome = req.body.nome;
        }
        if (req.body.estado !== undefined) {
            cliente.estado = req.body.estado;
        }
        if (req.body.preco !== undefined) {
            cliente.preco = parseFloat(req.body.preco);
        }

        const data = await cliente.atualizar();

        return res
            .status(200)
            .json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const cliente = await ClienteModel.buscarPorId(parseInt(id));

        if (!cliente) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
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
