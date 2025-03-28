# API con Express, TypeORM y Sequelize

Este proyecto es una API REST básica construida con Express.js, utilizando tanto TypeORM como Sequelize para la conexión con PostgreSQL.

## Requisitos previos

- Node.js >= 14.x
- PostgreSQL >= 12.x
- npm >= 6.x

## Configuración

1. Clona este repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración (o utiliza el archivo existente):

```
# Configuración de la base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Testing
DB_USER=postgres
DB_PASSWORD=12345678

# Configuración del servidor
PORT=3000
NODE_ENV=development
```

4. Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE Testing;
```

## Ejecución

### Desarrollo

Para ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
```

### Producción

Para compilar y ejecutar en producción:

```bash
npm run build
npm start
```

## Migraciones

Para generar una migración:

```bash
npm run migration:generate NombreMigracion
```

Para ejecutar las migraciones:

```bash
npm run migration:run
```

## Estructura del proyecto

```
src/
├── app.ts              # Punto de entrada de la aplicación
├── config/             # Configuraciones
│   ├── database.ts     # Configuración de TypeORM
│   └── sequelize.ts    # Configuración de Sequelize
├── controllers/        # Controladores
├── db/                 # Migraciones y seeds
├── models/             # Modelos (TypeORM y Sequelize)
└── routes/             # Rutas de la API
```

## Endpoints

- `GET /`: Verificar si la API está funcionando
- `GET /api/posts/typeorm`: Obtener posts (usando TypeORM)
- `POST /api/posts/typeorm`: Crear un nuevo post (usando TypeORM)
- `GET /api/posts/sequelize`: Obtener posts (usando Sequelize)
- `POST /api/posts/sequelize`: Crear un nuevo post (usando Sequelize) 