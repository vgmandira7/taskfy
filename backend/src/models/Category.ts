import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Interface que representa a entidade Category
export interface ICategory {
  id: number;
  name: string;
  description: string | null;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Campos opcionais na criação (gerados automaticamente ou com valor padrão)
export type CategoryCreationAttributes = Optional<
  ICategory,
  'id' | 'description' | 'color' | 'isActive' | 'createdAt' | 'updatedAt'
>;

export class Category
  extends Model<ICategory, CategoryCreationAttributes>
  implements ICategory
{
  declare id: number;
  declare name: string;
  declare description: string | null;
  declare color: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#6366F1',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
  },
);
