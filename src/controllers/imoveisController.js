import ImoveisModel from "../models/ImoveisModel.js";

export async function criar(req, res) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res
                .status(400)
                .json({ error: "Corpo da requisição vazio. Envie os dados!" });
        }

        const { nome, categoria, preco, disponivel } = req.body;

        if (!nome)
            return res.status(400).json({ error: 'O campo "nome" é obrigatório.' });
        if (!categoria)
            return res
                .status(400)
                .json({ error: 'O campo "categoria" é obrigatório.' });
        if (preco === undefined)
            return res.status(400).json({ error: 'O campo "preço" é obrigatório.' });
        if (disponivel === undefined)
            return res
                .status(400)
                .json({ error: 'O campo "disponível" é obrigatório.' });

        const imovelCriado = await ImoveisModel.criar(req.body);
        return res.status(201).json(imovelCriado);
    } catch (error) {
        console.error("Erro ao criar imóvel:", error);
        return res.status(500).json({ error: "Erro interno ao criar o imóvel." });
    }
}

export async function buscarTodos(req, res) {
    try {
        const imoveis = await ImoveisModel.buscarTodos(req.query);
        if (!imoveis || imoveis.length === 0) {
            return res.status(404).json({ message: "Nenhum imóvel encontrado." });
        }
        return res.status(200).json(imoveis);
    } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
        return res
            .status(500)
            .json({ error: "Erro interno ao buscar os imóveis." });
    }
}

export async function buscarPorId(req, res) {
    try {
        const { id } = req.params;
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: "O ID enviado não é um número válido." });
        }
        const imovel = await ImoveisModel.buscarPorId(parseInt(id));
        if (!imovel) {
            return res.status(404).json({ error: "Imóvel não encontrado." });
        }
        return res.status(200).json(imovel);
    } catch (error) {
        console.error("Erro ao buscar imóvel:", error);
        return res.status(500).json({ error: "Erro interno ao buscar o imóvel." });
    }
}

export async function atualizar(req, res) {
    try {
        const { id } = req.params;
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido." });
        }
        if (!req.body || Object.keys(req.body).length === 0) {
            return res
                .status(400)
                .json({ error: "Corpo da requisição vazio. Envie os dados!" });
        }
        const imovelExistente = await ImoveisModel.buscarPorId(parseInt(id));
        if (!imovelExistente) {
            return res
                .status(404)
                .json({ error: "Imóvel não encontrado para atualizar." });
        }
        if (imovelExistente.disponivel === false) {
            return res
                .status(400)
                .json({ error: "Imóvel indisponível. Não é possível atualizar." });
        }
        if (req.body.preco !== undefined && req.body.preco < 0) {
            return res
                .status(400)
                .json({ error: 'O campo "preço" deve ser um valor positivo.' });
        }

        const imovelAtualizado = await ImoveisModel.atualizar(
            parseInt(id),
            req.body,
        );
        return res.status(200).json(imovelAtualizado);
    } catch (error) {
        console.error("Erro ao atualizar imóvel:", error);
        return res
            .status(500)
            .json({ error: "Erro interno ao atualizar o imóvel." });
    }
}

export async function excluir(req, res) {
    try {
        const { id } = req.params;
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido." });
        }
        const imovelExistente = await ImoveisModel.buscarPorId(parseInt(id));
        if (!imovelExistente) {
            return res
                .status(404)
                .json({ error: "Imóvel não encontrado para exclusão." });
        }

        if (imovelExistente.disponivel === false) {
            return res
                .status(400)
                .json({ error: "Imóvel indisponível. Não é possível excluir." });
        }

        await ImoveisModel.excluir(parseInt(id));
        return res.status(204).send();
    } catch (error) {
        console.error("Erro ao excluir imóvel:", error);
        return res.status(500).json({ error: "Erro interno ao excluir o imóvel." });
    }
}
