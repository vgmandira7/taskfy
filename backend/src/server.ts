import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';
import { sequelize } from './config/database';
import { appRoutes } from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota de Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    mensagem: 'Taskfy API rodando com sucesso.',
    timestamp: new Date().toISOString(),
  });
});

// Documentação interativa (Swagger UI)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Registra todas as rotas da aplicação sob o prefixo /api
app.use('/api', appRoutes);

// Rota raiz - conveniência
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    projeto: 'Taskfy API',
    documentacao: '/api-docs',
    healthCheck: '/api/health',
  });
});

// Middleware de fallback para rotas não encontradas (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Middleware global de tratamento de erros (500)
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o PostgreSQL realizada com sucesso.');

    // Cria/ajusta as tabelas a partir dos models (Category e Task)
    await sequelize.sync();
    console.log('Tabelas sincronizadas com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor Taskfy rodando na porta ${PORT}`);
      console.log(`Documentação Swagger em: http://localhost:${PORT}/api-docs`);
      console.log(`Health check em: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  }
}

main();
