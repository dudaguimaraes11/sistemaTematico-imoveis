import multer from 'multer';

// Configuramos o multer para guardar o arquivo temporariamente na memória (buffer)
// Isso permite que o seu imageProcessor trate a imagem antes de salvar no disco
const storage = multer.memoryStorage();

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('O arquivo enviado não é uma imagem válida!'), false);
    }
};

export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB
    },
    fileFilter: fileFilter
});