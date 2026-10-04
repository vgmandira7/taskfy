import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Category } from './Category';

export type TaskStatus = 'pending' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export const TASK_STATUS_VALUES: TaskStatus[] = [
  'pending',
  'in_progress',
  'done',
];
export const TASK_PRIORITY_VALUES: TaskPriority[] = ['low', 'medium', 'high'];

// Interface que representa a entidade Task (entidade de negócio principal)
export interface ITask {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  categoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskCreationAttributes = Optional<
  ITask,
  | 'id'
  | 'description'
  | 'status'
  | 'priority'
  | 'dueDate'
  | 'categoryId'
  | 'createdAt'
  | 'updatedAt'
>;

export class Task
  extends Model<ITask, TaskCreationAttributes>
  implements ITask
{
  declare id: number;
  declare title: string;
  declare description: string | null;
  declare status: TaskStatus;
  declare priority: TaskPriority;
  declare dueDate: string | null;
  declare categoryId: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...TASK_STATUS_VALUES),
      allowNull: false,
      defaultValue: 'pending',
    },
    priority: {
      type: DataTypes.ENUM(...TASK_PRIORITY_VALUES),
      allowNull: false,
      defaultValue: 'medium',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'category_id',
      references: {
        model: Category,
        key: 'id',
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true,
  },
);

// Uma categoria possui várias tarefas; uma tarefa pertence a uma categoria
Category.hasMany(Task, { foreignKey: 'categoryId', as: 'tasks' });
Task.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
