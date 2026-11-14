import { api } from '@/lib/api'
import type { Category, CategoryPayload } from '@/types/category'

export const categoryService = {
  list: () => api.get<Category[]>('/categories'),
  create: (payload: CategoryPayload) =>
    api.post<Category, CategoryPayload>('/categories', payload),
  update: (id: number, payload: CategoryPayload) =>
    api.put<Category, CategoryPayload>(`/categories/${id}`, payload),
  remove: (id: number) => api.delete(`/categories/${id}`),
}
