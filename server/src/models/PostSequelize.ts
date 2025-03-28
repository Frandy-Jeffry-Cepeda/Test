import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';

class Post extends Model {
  public id!: number;
  public titulo!: string;
  public contenido!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'posts',
  }
);

export default Post; 