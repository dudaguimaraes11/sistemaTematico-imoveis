import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const processarFotoImovel = async (buffer, id) => {
    const nomeArquivo = `imovel-${id}-${Date.now()}.jpg`;
    const diretorioDestino = path.resolve(__dirname, '../../public/uploads/imoveis');
    const caminhoCompleto = path.join(diretorioDestino, nomeArquivo);

  if (!fs.existsSync(diretorioDestino)) {
        fs.mkdirSync(diretorioDestino, { recursive: true });
    }

    await sharp(buffer)
        .resize({ width: 800 }) 
        .toFormat('jpeg')
        .jpeg({ quality: 80 })
        .toFile(caminhoCompleto);

    return `public/uploads/imoveis/${nomeArquivo}`;
};

export const excluirArquivoLocal = (caminhoRelativo) => {
    if (!caminhoRelativo) return;
    const caminhoAbsoluto = path.resolve(__dirname, '../../', caminhoRelativo);
    if (fs.existsSync(caminhoAbsoluto)) {
        fs.unlinkSync(caminhoAbsoluto);
    }
};
