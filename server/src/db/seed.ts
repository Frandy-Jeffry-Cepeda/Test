import { AppDataSource } from '../config/database';
import { Post } from '../models/Post';
import PostSequelize from '../models/PostSequelize';

// Datos de ejemplo para los posts
const samplePosts = [
  {
    titulo: 'Primer Post',
    contenido: 'Este es el contenido del primer post de ejemplo.'
  },
  {
    titulo: 'Segundo Post',
    contenido: 'Este es el contenido del segundo post de ejemplo. Este post tiene un contenido más extenso para mostrar cómo se maneja el texto largo.'
  },
  {
    titulo: 'Tercer Post',
    contenido: 'Este es el tercer post de ejemplo con información de muestra.'
  }
];

// Función para sembrar datos con TypeORM
const seedTypeORM = async () => {
  try {
    // Inicializar la conexión
    await AppDataSource.initialize();
    console.log('✅ TypeORM inicializado correctamente');

    // Insertar posts
    const postRepository = AppDataSource.getRepository(Post);
    
    // Verificar si ya existen posts
    const existingCount = await postRepository.count();
    if (existingCount > 0) {
      console.log('⚠️ Ya existen posts en la base de datos TypeORM. Omitiendo la inserción...');
      return;
    }
    
    const posts = samplePosts.map(post => postRepository.create(post));
    await postRepository.save(posts);
    
    console.log(`✅ ${posts.length} posts insertados usando TypeORM`);
  } catch (error) {
    console.error('❌ Error al sembrar datos con TypeORM:', error);
  } finally {
    // Cerrar la conexión
    await AppDataSource.destroy();
  }
};

// Función para sembrar datos con Sequelize
const seedSequelize = async () => {
  try {
    // Verificar si ya existen posts
    const count = await PostSequelize.count();
    if (count > 0) {
      console.log('⚠️ Ya existen posts en la base de datos Sequelize. Omitiendo la inserción...');
      return;
    }
    
    // Insertar posts
    await PostSequelize.bulkCreate(samplePosts);
    
    console.log(`✅ ${samplePosts.length} posts insertados usando Sequelize`);
  } catch (error) {
    console.error('❌ Error al sembrar datos con Sequelize:', error);
  }
};

// Función principal para sembrar todos los datos
const seedAll = async () => {
  try {
    // Sembrar datos con TypeORM
    await seedTypeORM();
    
    // Sembrar datos con Sequelize
    await seedSequelize();
    
    console.log('✅ Proceso de sembrado completado exitosamente');
  } catch (error) {
    console.error('❌ Error en el proceso de sembrado:', error);
  } finally {
    process.exit(0);
  }
};

// Ejecutar la función de sembrado
seedAll(); 