import type { Category } from '@/types/category'

export type TaskStatus = 'pending' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export const TASK_STATUS_VALUES: TaskStatus[] = ['pending', 'in_progress', 'done']
export const TASK_PRIORITY_VALUES: TaskPriority[] = ['low', 'medium', 'high']

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  done: 'Concluída',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

/** Tarefa, exatamente como a API (backend/src/models/Task.ts) devolve. */
export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  /** Data no formato AAAA-MM-DD (DATEONLY no banco) */
  dueDate: string | null
  categoryId: number | null
  /** A API inclui a categoria associada (ou null) */
  category: Category | null
  createdAt: string
  updatedAt: string
}

/** Corpo enviado no POST/PUT/PATCH de /api/tasks. */
export interface TaskPayload {
  title: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
  categoryId?: number | null
}
