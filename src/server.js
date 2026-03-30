import express from 'express';
import 'dotenv/config';
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import imoveisRoutes from './routes/imoveisRoute.js';
import clientesRoutes from './routes/clientesRoute.js';

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use('/public', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/api', imoveisRoutes);
app.use('/api', clientesRoutes);

// Tratamento de Erros do Multer
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Arquivo muito grande. Máximo 5MB.' });
    }
    if (err.message === 'Formato de imagem inválido. Use JPEG ou PNG.') {
        return res.status(400).json({ error: err.message });
    }
    next(err);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
