import { Router } from 'express';
import { 
  createPostTypeORM, 
  getPostsTypeORM, 
  createPostSequelize, 
  getPostsSequelize 
} from '../controllers/postController';

const router = Router();

// TypeORM routes
router.post('/typeorm', createPostTypeORM as any);
router.get('/typeorm', getPostsTypeORM as any);

// Sequelize routes
router.post('/sequelize', createPostSequelize as any);
router.get('/sequelize', getPostsSequelize as any);

export default router; 