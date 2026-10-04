import { Options, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Habilita SSL apenas quando DB_SSL=true (necessário para bancos em nuvem
// como o Supabase; desnecessário e geralmente incompatível em ambiente local)
const isSSL = process.env.DB_SSL === 'true';

const sequelizeOptions: Options = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  dialect: 'postgres',
  logging: false,
  dialectOptions: isSSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
};

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'taskfy',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  sequelizeOptions,
);
