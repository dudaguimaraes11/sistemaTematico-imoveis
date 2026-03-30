import pg from 'pg';
import 'dotenv/config';
import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Resetando tabela exemplo...');

    // Remove todos os registros
    await prisma.imoveis.deleteMany();
    await prisma.cliente.deleteMany();

    console.log('📦 Inserindo novos registros...');

    await prisma.cliente.createMany({
    data: [
      {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        cpf: '11111111111',
        telefone: '11999990001',
        cep: null,
        logradouro: null,
        bairro: null,
        localidade: null,
        uf: null,
      },
      {
        id: 2,
        nome: 'Maria Oliveira',
        email: 'maria@email.com',
        cpf: '22222222222',
        telefone: '11999990002',
        cep: null,
        logradouro: null,
        bairro: null,
        localidade: null,
        uf: null,
      },
      {
        id: 3,
        nome: 'Carlos Souza',
        email: 'carlos@email.com',
        cpf: '33333333333',
        telefone: '11999990003',
        cep: null,
        logradouro: null,
        bairro: null,
        localidade: null,
        uf: null,
      },
      {
        id: 4,
        nome: 'Ana Lima',
        email: 'ana@email.com',
        cpf: '44444444444',
        telefone: '11999990004',
        cep: null,
        logradouro: null,
        bairro: null,
        localidade: null,
        uf: null,
      },
      {
        id: 5,
        nome: 'Pedro Santos',
        email: 'pedro@email.com',
        cpf: '55555555555',
        telefone: '11999990005',
        cep: null,
        logradouro: null,
        bairro: null,
        localidade: null,
        uf: null,
      }
    ],
  });

  console.log('🏠 Inserindo imóveis...');

  await prisma.imoveis.createMany({
    data: [
      {
        nome: 'Apartamento Centro',
        descricao: '2 quartos',
        categoria: 'APARTAMENTO',
        preco: 300000,
        disponivel: true,
        clienteId: 1
      },
      {
        nome: 'Casa com garagem',
        descricao: '3 quartos',
        categoria: 'CASA',
        preco: 500000,
        disponivel: true,
        clienteId: 2
      },
      {
        nome: 'Terreno amplo',
        descricao: '500m²',
        categoria: 'TERRENO',
        preco: 200000,
        disponivel: true,
        clienteId: 3
      },
      {
        nome: 'Sala comercial',
        descricao: 'Centro empresarial',
        categoria: 'COMERCIAL',
        preco: 350000,
        disponivel: false,
        clienteId: 4
      },
      {
        nome: 'Apartamento luxo',
        descricao: 'Cobertura',
        categoria: 'APARTAMENTO',
        preco: 900000,
        disponivel: true,
        clienteId: 5
      }
    ],
  });

  console.log('✅ Seed finalizado com 5 clientes e 5 imóveis!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('✅ Seed concluído!');
    });