import { api } from '@/lib/api'
import type { Task, TaskPayload } from '@/types/task'

export const taskService = {
  list: () => api.get<Task[]>('/tasks'),
  create: (payload: TaskPayload) => api.post<Task, TaskPayload>('/tasks', payload),
  update: (id: number, payload: TaskPayload) =>
    api.put<Task, TaskPayload>(`/tasks/${id}`, payload),
  /** Atualização parcial (usada para trocar só o status direto na tabela). */
  patch: (id: number, payload: Partial<TaskPayload>) =>
    api.patch<Task, Partial<TaskPayload>>(`/tasks/${id}`, payload),
  remove: (id: number) => api.delete(`/tasks/${id}`),
}
