/** Categoria, exatamente como a API (backend/src/models/Category.ts) devolve. */
export interface Category {
  id: number
  name: string
  description: string | null
  /** Cor em hexadecimal, ex: #6366F1 */
  color: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/** Corpo enviado no POST/PUT de /api/categories. */
export interface CategoryPayload {
  name: string
  description?: string | null
  color?: string
  isActive?: boolean
}
