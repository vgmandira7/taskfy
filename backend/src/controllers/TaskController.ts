import { Request, Response } from 'express';
import {
  Task,
  TASK_STATUS_VALUES,
  TASK_PRIORITY_VALUES,
  TaskStatus,
  TaskPriority,
} from '../models/Task';
import { Category } from '../models/Category';

export class TaskController {
  // GET /api/tasks - Lista todas as tarefas (com filtros opcionais)
  // Filtros suportados via query string: ?status=pending&priority=high&categoryId=1
  public static async index(req: Request, res: Response): Promise<Response> {
    try {
      const { status, priority, categoryId } = req.query;
      const where: Record<string, unknown> = {};

      if (status !== undefined) {
        if (!TASK_STATUS_VALUES.includes(status as TaskStatus)) {
          return res.status(400).json({
            erro: `O filtro "status" deve ser um dos seguintes valores: ${TASK_STATUS_VALUES.join(', ')}.`,
          });
        }
        where.status = status;
      }

      if (priority !== undefined) {
        if (!TASK_PRIORITY_VALUES.includes(priority as TaskPriority)) {
          return res.status(400).json({
            erro: `O filtro "priority" deve ser um dos seguintes valores: ${TASK_PRIORITY_VALUES.join(', ')}.`,
          });
        }
        where.priority = priority;
      }

      if (categoryId !== undefined) {
        const parsedCategoryId = parseInt(categoryId as string, 10);
        if (isNaN(parsedCategoryId)) {
          return res
            .status(400)
            .json({ erro: 'O filtro "categoryId" deve ser um número válido.' });
        }
        where.categoryId = parsedCategoryId;
      }

      const tasks = await Task.findAll({
        where,
        include: [{ model: Category, as: 'category' }],
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(tasks);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return res
        .status(500)
        .json({ erro: 'Erro ao listar tarefas.', detalhe: message });
    }
  }

  // GET /api/tasks/:id - Busca uma tarefa específica por ID
  public static async show(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID informado deve ser um número válido.' });
      }

      const task = await Task.findByPk(id, {
        include: [{ model: Category, as: 'category' }],
      });

      if (!task) {
        return res.status(404).json({ erro: 'Tarefa não encontrada.' });
      }

      return res.status(200).json(task);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return res
        .status(500)
        .json({ erro: 'Erro ao buscar tarefa.', detalhe: message });
    }
  }

  // POST /api/tasks - Cria uma nova tarefa
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, status, priority, dueDate, categoryId } =
        req.body;

      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ erro: 'O campo "title" é obrigatório.' });
      }

      if (status !== undefined && !TASK_STATUS_VALUES.includes(status)) {
        return res.status(400).json({
          erro: `O campo "status" deve ser um dos seguintes valores: ${TASK_STATUS_VALUES.join(', ')}.`,
        });
      }

      if (priority !== undefined && !TASK_PRIORITY_VALUES.includes(priority)) {
        return res.status(400).json({
          erro: `O campo "priority" deve ser um dos seguintes valores: ${TASK_PRIORITY_VALUES.join(', ')}.`,
        });
      }

      if (dueDate !== undefined && dueDate !== null) {
        if (isNaN(Date.parse(dueDate))) {
          return res.status(400).json({
            erro: 'O campo "dueDate" deve ser uma data válida (formato AAAA-MM-DD).',
          });
        }
      }

      if (categoryId !== undefined && categoryId !== null) {
        const categoria = await Category.findByPk(categoryId);
        if (!categoria) {
          return res.status(400).json({
            erro: 'A categoria informada em "categoryId" não existe.',
          });
        }
      }

      const novaTarefa = await Task.create({
        title: title.trim(),
        description: description ?? null,
        status: status ?? 'pending',
        priority: priority ?? 'medium',
        dueDate: dueDate ?? null,
        categoryId: categoryId ?? null,
      });

      const tarefaCriada = await Task.findByPk(novaTarefa.id, {
        include: [{ model: Category, as: 'category' }],
      });

      return res.status(201).json(tarefaCriada);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return res
        .status(500)
        .json({ erro: 'Erro ao criar tarefa.', detalhe: message });
    }
  }

  // PUT/PATCH /api/tasks/:id - Atualiza uma tarefa existente
  public static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID informado deve ser um número válido.' });
      }

      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({ erro: 'Tarefa não encontrada.' });
      }

      const { title, description, status, priority, dueDate, categoryId } =
        req.body;

      if (title !== undefined) {
        if (typeof title !== 'string' || title.trim() === '') {
          return res
            .status(400)
            .json({ erro: 'O campo "title" deve ser um texto válido.' });
        }
        task.title = title.trim();
      }

      if (status !== undefined) {
        if (!TASK_STATUS_VALUES.includes(status)) {
          return res.status(400).json({
            erro: `O campo "status" deve ser um dos seguintes valores: ${TASK_STATUS_VALUES.join(', ')}.`,
          });
        }
        task.status = status;
      }

      if (priority !== undefined) {
        if (!TASK_PRIORITY_VALUES.includes(priority)) {
          return res.status(400).json({
            erro: `O campo "priority" deve ser um dos seguintes valores: ${TASK_PRIORITY_VALUES.join(', ')}.`,
          });
        }
        task.priority = priority;
      }

      if (dueDate !== undefined) {
        if (dueDate !== null && isNaN(Date.parse(dueDate))) {
          return res.status(400).json({
            erro: 'O campo "dueDate" deve ser uma data válida (formato AAAA-MM-DD).',
          });
        }
        task.dueDate = dueDate;
      }

      if (categoryId !== undefined) {
        if (categoryId !== null) {
          const categoria = await Category.findByPk(categoryId);
          if (!categoria) {
            return res.status(400).json({
              erro: 'A categoria informada em "categoryId" não existe.',
            });
          }
        }
        task.categoryId = categoryId;
      }

      if (description !== undefined) {
        task.description = description;
      }

      await task.save();

      const tarefaAtualizada = await Task.findByPk(task.id, {
        include: [{ model: Category, as: 'category' }],
      });

      return res.status(200).json(tarefaAtualizada);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return res
        .status(500)
        .json({ erro: 'Erro ao atualizar tarefa.', detalhe: message });
    }
  }

  // DELETE /api/tasks/:id - Remove uma tarefa
  public static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID informado deve ser um número válido.' });
      }

      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({ erro: 'Tarefa não encontrada.' });
      }

      await task.destroy();

      return res.status(204).send();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return res
        .status(500)
        .json({ erro: 'Erro ao remover tarefa.', detalhe: message });
    }
  }
}
