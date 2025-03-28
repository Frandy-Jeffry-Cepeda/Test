import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Post } from '../models/Post';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '12345678',
  database: process.env.DB_NAME || 'Testing',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [Post],
  migrations: ['dist/db/migrations/**/*.js'],
  subscribers: ['dist/db/subscribers/**/*.js'],
}); 