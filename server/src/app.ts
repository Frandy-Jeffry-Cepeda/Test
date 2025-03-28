import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import sequelize from './config/sequelize';
import postRoutes from './routes/postRoutes';
import PostSequelize from './models/PostSequelize';

// Configuración de variables de entorno
dotenv.config();

// Inicialización de Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/posts', postRoutes);

// Ruta de prueba
app.get('/', (_req, res) => {
  res.send('API funcionando correctamente');
});

// Middleware para manejar rutas no encontradas
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware para manejar errores
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

// Inicio de la base de datos y servidor
const startServer = async () => {
  try {
    // Iniciar TypeORM
    await AppDataSource.initialize();
    console.log('✅ TypeORM inicializado correctamente');

    // Iniciar Sequelize
    await sequelize.authenticate();
    console.log('✅ Sequelize conectado correctamente');
    
    // Sincronizar modelos de Sequelize con la base de datos
    await sequelize.sync();
    console.log('✅ Tablas de Sequelize sincronizadas correctamente');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
};

startServer(); 