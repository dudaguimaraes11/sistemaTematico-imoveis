import express from 'express';
import 'dotenv/config';
import imoveisRoutes from './routes/imoveisRoute.js';
import clientesRoutes from './routes/clienteRoutes.js';

import pdfRoutes from './routes/pdfRoutes.js';

import e from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/api', imoveisRoutes);
app.use('/api', clientesRoutes);
app.use('/', express.static('uploads'));
app.use('/api', pdfRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
