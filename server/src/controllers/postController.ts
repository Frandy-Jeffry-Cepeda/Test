import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Post } from '../models/Post';
import PostSequelize from '../models/PostSequelize';

// TypeORM Repository
const postRepository = AppDataSource.getRepository(Post);

// Crear un post con TypeORM
export const createPostTypeORM = async (req: Request, res: Response) => {
  try {
    const { titulo, contenido } = req.body;

    // Validaciones básicas
    if (!titulo || !contenido) {
      return res.status(400).json({
        success: false,
        message: 'El título y el contenido son obligatorios'
      });
    }

    // Crear el nuevo post
    const newPost = postRepository.create({
      titulo,
      contenido
    });

    // Guardar en la base de datos
    await postRepository.save(newPost);

    return res.status(201).json({
      success: true,
      data: newPost
    });
  } catch (error) {
    console.error('Error al crear post con TypeORM:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener todos los posts con TypeORM
export const getPostsTypeORM = async (_req: Request, res: Response) => {
  try {
    const posts = await postRepository.find();
    return res.status(200).json({
      success: true,
      data: posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Error al obtener posts con TypeORM:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear un post con Sequelize
export const createPostSequelize = async (req: Request, res: Response) => {
  try {
    const { titulo, contenido } = req.body;

    // Validaciones básicas
    if (!titulo || !contenido) {
      return res.status(400).json({
        success: false,
        message: 'El título y el contenido son obligatorios'
      });
    }

    // Crear y guardar el post
    const newPost = await PostSequelize.create({
      titulo,
      contenido
    });

    return res.status(201).json({
      success: true,
      data: newPost
    });
  } catch (error) {
    console.error('Error al crear post con Sequelize:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener todos los posts con Sequelize
export const getPostsSequelize = async (_req: Request, res: Response) => {
  try {
    const posts = await PostSequelize.findAll();
    return res.status(200).json({
      success: true,
      data: posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Error al obtener posts con Sequelize:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}; 