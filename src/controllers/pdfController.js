import ImoveisModel from '../models/ImoveisModel.js';
import { gerarPdfTodos, gerarPdfImovel } from '../utils/pdfHelper.js';

export const imovelPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID do imóvel enviado não é um número válido.' });
        }

        const imovel = await ImoveisModel.buscarPorId(parseInt(id));

        if (!imovel) {
            return res.status(404).json({ error: 'Registro do imóvel não encontrado.' });
        }

        const pdf = await gerarPdfImovel(imovel);
        return res
            .set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="imovel_${id}.pdf"`,
            })

            .send(pdf);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        return res.status(500).json({ error: 'Erro ao gerar relatório do imóvel.' });
    }
};

export const imoveisTodos = async (req, res) => {
    try {
        const imoveis = await ImoveisModel.buscarTodos(req.query);

        if (!imoveis || imoveis.length === 0) {
            return res.status(200).json({ message: 'Nenhum registro de imóvel encontrado.' });
        }

        const pdf = await gerarPdfTodos(imoveis);

        return res
            .set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="imoveis.pdf"',
            })
            .send(pdf);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).json({ error: 'Erro ao gerar relatório de imóvel.' });
    }
};
