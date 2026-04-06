import { processarFotoImovel, excluirArquivoLocal } from '../utils/imageProcessor.js';
import prisma from '../utils/prismaClient.js';

export const uploadFoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'Campo obrigatório não informado (foto).' });
        }

        const imovel = await prisma.imovel.findUnique({ where: { id: Number(id) } });

        if (!imovel) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        if (!imovel.disponivel) {
            return res.status(400).json({ error: 'Não é permitido utilizar item indisponível.' });
        }

        if (imovel.foto) {
            excluirArquivoLocal(imovel.foto);
        }

        const novoCaminho = await processarFotoImovel(req.file.buffer, id);

        const imovelAtualizado = await prisma.imovel.update({
            where: { id: Number(id) },
            data: { foto: novoCaminho },
        });

        return res.status(200).json(imovelAtualizado);
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno ao processar a imagem.' });
    }
};

export const getFoto = async (req, res) => {
    try {
        const { id } = req.params;
        const imovel = await prisma.imovel.findUnique({ where: { id: Number(id) } });

        if (!imovel || !imovel.foto) {
            return res.status(404).json({ error: 'Foto não encontrada.' });
        }

        return res.status(200).json({ url: `http://localhost:3001/${imovel.foto}` });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar a foto.' });
    }
};