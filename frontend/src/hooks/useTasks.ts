import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getErrorMessage } from '@/lib/api'
import { taskService } from '@/services/taskService'
import type { Task, TaskPayload, TaskStatus } from '@/types/task'

/**
 * Estado reativo das tarefas + operações de CRUD.
 * Cada operação chama a API, atualiza o estado local e dispara o toast correspondente.
 * As funções de escrita retornam true/false para que a tela saiba se pode fechar o modal.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // READ (GET /api/tasks)
  const load = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      setTasks(await taskService.list())
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      toast.error('Erro ao carregar as tarefas', { id: 'load-tasks-error', description: message })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  // CREATE (POST /api/tasks)
  const create = useCallback(async (payload: TaskPayload): Promise<boolean> => {
    try {
      const created = await taskService.create(payload)
      setTasks((prev) => [created, ...prev])
      toast.success('Tarefa criada com sucesso', { description: created.title })
      return true
    } catch (err) {
      toast.error('Não foi possível criar a tarefa', { description: getErrorMessage(err) })
      return false
    }
  }, [])

  // UPDATE (PUT /api/tasks/:id)
  const update = useCallback(async (id: number, payload: TaskPayload): Promise<boolean> => {
    try {
      const updated = await taskService.update(id, payload)
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)))
      toast.success('Tarefa atualizada com sucesso', { description: updated.title })
      return true
    } catch (err) {
      toast.error('Não foi possível atualizar a tarefa', { description: getErrorMessage(err) })
      return false
    }
  }, [])

  // UPDATE parcial (PATCH /api/tasks/:id) - troca rápida de status na tabela
  const changeStatus = useCallback(async (id: number, status: TaskStatus): Promise<boolean> => {
    try {
      const updated = await taskService.patch(id, { status })
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)))
      toast.success('Status atualizado', { description: updated.title })
      return true
    } catch (err) {
      toast.error('Não foi possível alterar o status', { description: getErrorMessage(err) })
      return false
    }
  }, [])

  // DELETE (DELETE /api/tasks/:id)
  const remove = useCallback(async (id: number): Promise<boolean> => {
    try {
      await taskService.remove(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
      toast.success('Tarefa excluída com sucesso')
      return true
    } catch (err) {
      toast.error('Não foi possível excluir a tarefa', { description: getErrorMessage(err) })
      return false
    }
  }, [])

  return { tasks, loading, error, reload: load, create, update, changeStatus, remove }
}
