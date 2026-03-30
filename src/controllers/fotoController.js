import fs from 'fs/promises';
import AlunoModel from '../models/ImoveisModel.js';
import { processarFoto, removerFoto } from '../utils/fotoHelper.js';

export const verFoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const imovel = await ImoveisModel.buscarPorId(parseInt(id));

        if (!imovel) {
            return res.status(404).json({ error: 'Registro de aluno não encontrado.' });
        }
        if (!imovel.foto) {
            return res.status(404).json({
                error: 'Este aluno não possui foto cadastrada',
            });
        }
        return res.sendFile(imovel.foto, { root: '.' });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar foto do imóvel.' });
    }
};

export const uploadFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma foto enviada!' });
        }

        const { id } = req.params;

        if (isNaN(id))
            return res.status(400).json({ error: 'O ID enviado não é um número válido' });

        const imoveis = await ImoveisModel.buscarPorId(parseInt(id));
        if (!imoveis) {
            removerFoto(req.file.path);
            return res.status(404).json({ error: 'Registo de imóvel não encontrado.' });
        }

        if (imoveis.foto) {
            await fs.unlink(imoveis.foto).catch(() => {});
        }

        imoveis.foto = await processarFoto(req.file.path);
        await aluno.atualizar();

        return res.status(201).json({ message: 'Foto salva com sucesso!', foto: imoveis.foto });
    } catch (error) {
        console.error('Erro ao salvar foto:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar a foto.' });
    }
};
