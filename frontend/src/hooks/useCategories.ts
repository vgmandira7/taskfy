import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getErrorMessage } from '@/lib/api'
import { categoryService } from '@/services/categoryService'
import type { Category, CategoryPayload } from '@/types/category'

const byName = (a: Category, b: Category): number => a.name.localeCompare(b.name, 'pt-BR')

/** Estado reativo das categorias + operações de CRUD (mesmo padrão do useTasks). */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // READ (GET /api/categories)
  const load = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      setCategories(await categoryService.list())
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      toast.error('Erro ao carregar as categorias', {
        id: 'load-categories-error',
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  // CREATE (POST /api/categories)
  const create = useCallback(async (payload: CategoryPayload): Promise<boolean> => {
    try {
      const created = await categoryService.create(payload)
      setCategories((prev) => [...prev, created].sort(byName))
      toast.success('Categoria criada com sucesso', { description: created.name })
      return true
    } catch (err) {
      toast.error('Não foi possível criar a categoria', { description: getErrorMessage(err) })
      return false
    }
  }, [])

  // UPDATE (PUT /api/categories/:id)
  const update = useCallback(async (id: number, payload: CategoryPayload): Promise<boolean> => {
    try {
      const updated = await categoryService.update(id, payload)
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)).sort(byName))
      toast.success('Categoria atualizada com sucesso', { description: updated.name })
      return true
    } catch (err) {
      toast.error('Não foi possível atualizar a categoria', { description: getErrorMessage(err) })
      return false
    }
  }, [])

  // DELETE (DELETE /api/categories/:id)
  const remove = useCallback(async (id: number): Promise<boolean> => {
    try {
      await categoryService.remove(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast.success('Categoria excluída com sucesso')
      return true
    } catch (err) {
      toast.error('Não foi possível excluir a categoria', { description: getErrorMessage(err) })
      return false
    }
  }, [])

  return { categories, loading, error, reload: load, create, update, remove }
}
