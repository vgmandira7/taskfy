import { useState } from 'react'
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react'

import { CategoryFormDialog } from '@/components/categories/CategoryFormDialog'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategories } from '@/hooks/useCategories'
import type { Category, CategoryPayload } from '@/types/category'

export default function CategoriesPage() {
  const { categories, loading, error, reload, create, update, remove } = useCategories()

  const [formOpen, setFormOpen] = useState<boolean>(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<boolean>(false)

  const openCreate = (): void => {
    setEditingCategory(null)
    setFormOpen(true)
  }

  const openEdit = (category: Category): void => {
    setEditingCategory(category)
    setFormOpen(true)
  }

  const handleSubmit = (payload: CategoryPayload): Promise<boolean> =>
    editingCategory ? update(editingCategory.id, payload) : create(payload)

  const handleConfirmDelete = async (): Promise<void> => {
    if (!categoryToDelete) return
    setDeleting(true)
    const success = await remove(categoryToDelete.id)
    setDeleting(false)
    if (success) setCategoryToDelete(null)
  }

  const newCategoryButton = (
    <Button onClick={openCreate}>
      <Plus />
      Nova categoria
    </Button>
  )

  function renderContent() {
    if (error) return <ErrorState message={error} onRetry={() => void reload()} />

    if (loading) {
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      )
    }

    if (categories.length === 0) {
      return (
        <EmptyState
          icon={Tags}
          title="Nenhuma categoria cadastrada"
          description="Crie categorias como Faculdade, Trabalho ou Pessoal para organizar suas tarefas."
          action={newCategoryButton}
        />
      )
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="gap-4 overflow-hidden py-0">
            <div className="h-1.5" style={{ backgroundColor: category.color }} aria-hidden="true" />
            <CardHeader className="gap-2 px-5">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{category.name}</CardTitle>
                <Badge variant={category.isActive ? 'secondary' : 'outline'}>
                  {category.isActive ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 min-h-10">
                {category.description ?? 'Sem descrição.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2 px-5 pb-4">
              <Button variant="outline" size="sm" onClick={() => openEdit(category)}>
                <Pencil />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setCategoryToDelete(category)}
              >
                <Trash2 />
                Excluir
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Categorias"
        description="Organize suas tarefas por assunto, com cores para identificar rapidamente."
        action={newCategoryButton}
      />

      {renderContent()}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={categoryToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setCategoryToDelete(null)
        }}
        title="Excluir categoria?"
        description={`A categoria "${categoryToDelete?.name ?? ''}" será removida permanentemente. As tarefas associadas a ela podem ficar sem categoria.`}
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </>
  )
}
