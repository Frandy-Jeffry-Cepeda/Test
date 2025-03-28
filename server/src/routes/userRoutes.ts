import { Router } from 'express';
import { getUsersTypeORM, getUsersSequelize } from '../controllers/userController';

const router = Router();

// TypeORM routes
router.get('/typeorm', getUsersTypeORM as any);

// Sequelize routes
router.get('/sequelize', getUsersSequelize as any);

export default router; 