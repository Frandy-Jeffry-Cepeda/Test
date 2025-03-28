import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import UserSequelize from '../models/UserSequelize';

// TypeORM Repository
const userRepository = AppDataSource.getRepository(User);

export const getUsersTypeORM = async (_req: Request, res: Response) => {
  try {
    const users = await userRepository.find();
    return res.status(200).json({ 
      success: true,
      data: users,
      count: users.length 
    });
  } catch (error) {
    console.error('Error obteniendo usuarios con TypeORM:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido' 
    });
  }
};

export const getUsersSequelize = async (_req: Request, res: Response) => {
  try {
    const users = await UserSequelize.findAll();
    return res.status(200).json({ 
      success: true,
      data: users,
      count: users.length 
    });
  } catch (error) {
    console.error('Error obteniendo usuarios con Sequelize:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido' 
    });
  }
}; 