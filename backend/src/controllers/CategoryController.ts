import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { Task } from '../models/Task';

export class CategoryController {
  // GET /api/categories - Lista todas as categorias
  public static async index(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await Category.findAll({
        order: [['name', 'ASC']],
      });
      return res.status(200).json(categories);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return res
        .status(500)
        .json({ erro: 'Erro ao listar categorias.', detalhe: message });
    }
  }

  // GET /api/categories/:id - Busca uma categoria por ID
  public static async show(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID informado deve ser um número válido.' });
      }

      const category = await Category.findByPk(id, {
        include: [{ model: Task, as: 'tasks' }],
      });

      if (!category) {
        return res.status(404).json({ erro: 'Categoria não encontrada.' });
      }

      return res.status(200).json(category);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return res
        .status(500)
        .json({ erro: 'Erro ao buscar categoria.', detalhe: message });
    }
  }

  // POST /api/categories - Cria uma nova categoria
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description, color, isActive } = req.body;

      if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ erro: 'O campo "name" é obrigatório.' });
      }

      if (color !== undefined && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        return res.status(400).json({
          erro: 'O campo "color" deve ser um código hexadecimal válido (ex: #6366F1).',
        });
      }

      const existente = await Category.findOne({
        where: { name: name.trim() },
      });
      if (existente) {
        return res
          .status(400)
          .json({ erro: 'Já existe uma categoria cadastrada com este nome.' });
      }

      const novaCategoria = await Category.create({
        name: name.trim(),
        description: description ?? null,
        color: color ?? '#6366F1',
        isActive: isActive ?? true,
      });

      return res.status(201).json(novaCategoria);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return res
        .status(500)
        .json({ erro: 'Erro ao criar categoria.', detalhe: message });
    }
  }

  // PUT /api/categories/:id - Atualiza uma categoria existente
  public static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID informado deve ser um número válido.' });
      }

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ erro: 'Categoria não encontrada.' });
      }

      const { name, description, color, isActive } = req.body;

      if (name !== undefined) {
        if (typeof name !== 'string' || name.trim() === '') {
          return res
            .status(400)
            .json({ erro: 'O campo "name" deve ser um texto válido.' });
        }
        category.name = name.trim();
      }

      if (color !== undefined) {
        if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
          return res.status(400).json({
            erro: 'O campo "color" deve ser um código hexadecimal válido (ex: #6366F1).',
          });
        }
        category.color = color;
      }

      if (description !== undefined) {
        category.description = description;
      }

      if (isActive !== undefined) {
        category.isActive = Boolean(isActive);
      }

      await category.save();

      return res.status(200).json(category);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return res
        .status(500)
        .json({ erro: 'Erro ao atualizar categoria.', detalhe: message });
    }
  }

  // DELETE /api/categories/:id - Remove uma categoria
  public static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({ erro: 'O ID informado deve ser um número válido.' });
      }

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ erro: 'Categoria não encontrada.' });
      }

      await category.destroy();

      return res.status(204).send();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return res
        .status(500)
        .json({ erro: 'Erro ao remover categoria.', detalhe: message });
    }
  }
}
