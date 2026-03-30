const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();

class FotoController {
    async uploadFoto(req, res) {
        try {
            const { id } = req.params;
          
            if (!req.file) {
                return res.status(400).json({ error: "Campo foto é obrigatório." });
            }

            const imovel = await prisma.imovel.findUnique({ where: { id: Number(id) } });

            if (!imovel) {
                return res.status(404).json({ error: "Imóvel não encontrado." });
            }

            if (!imovel.disponivel) {
                return res.status(400).json({ error: "Não é permitido utilizar item indisponível." });
            }

            const fileName = `imovel-${id}-${Date.now()}.jpg`;
            const uploadPath = path.resolve(__dirname, '../../public/uploads/imoveis');
            const fullPath = path.join(uploadPath, fileName);
            const dbPath = `public/uploads/imoveis/${fileName}`;

            await sharp(req.file.buffer)
                .resize(800) 
                .toFormat('jpeg')
                .jpeg({ quality: 80 })
                .toFile(fullPath);
          
            if (imovel.foto) {
                const oldPath = path.resolve(__dirname, '../../', imovel.foto);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            const imovelAtualizado = await prisma.imovel.update({
                where: { id: Number(id) },
                data: { foto: dbPath }
            });

            return res.status(200).json(imovelAtualizado);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno ao processar a imagem." });
        }
    }

    async getFoto(req, res) {
        try {
            const { id } = req.params;
            const imovel = await prisma.imovel.findUnique({ where: { id: Number(id) } });

            if (!imovel || !imovel.foto) {
                return res.status(404).json({ error: "Foto não encontrada." });
            }

            const imagePath = path.resolve(__dirname, '../../', imovel.foto);
            return res.sendFile(imagePath);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar a foto." });
        }
    }
}

module.exports = new FotoController();
