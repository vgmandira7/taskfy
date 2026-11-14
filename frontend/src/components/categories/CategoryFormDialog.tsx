import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Category, CategoryPayload } from '@/types/category'

const DEFAULT_COLOR = '#6366F1'

interface CategoryFormState {
  name: string
  description: string
  color: string
  isActive: boolean
}

const EMPTY_FORM: CategoryFormState = {
  name: '',
  description: '',
  color: DEFAULT_COLOR,
  isActive: true,
}

function toFormState(category: Category | null): CategoryFormState {
  if (!category) return EMPTY_FORM
  return {
    name: category.name,
    description: category.description ?? '',
    color: category.color,
    isActive: category.isActive,
  }
}

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null = modo cadastro; Category = modo edição */
  category: Category | null
  onSubmit: (payload: CategoryPayload) => Promise<boolean>
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
}: CategoryFormDialogProps) {
  const [form, setForm] = useState<CategoryFormState>(EMPTY_FORM)
  const [nameError, setNameError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const isEditing = category !== null

  useEffect(() => {
    if (open) {
      setForm(toFormState(category))
      setNameError(null)
    }
  }, [open, category])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false

    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (name === 'name') setNameError(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (form.name.trim() === '') {
      setNameError('Informe o nome da categoria.')
      return
    }

    const payload: CategoryPayload = {
      name: form.name.trim(),
      description: form.description.trim() === '' ? null : form.description.trim(),
      color: form.color,
      isActive: form.isActive,
    }

    setSubmitting(true)
    const success = await onSubmit(payload)
    setSubmitting(false)

    if (success) onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
          <DialogDescription>
            Categorias ajudam a organizar suas tarefas por assunto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength={100}
              placeholder="Ex.: Faculdade"
              aria-invalid={nameError !== null}
              autoFocus
            />
            {nameError && <p className="text-sm text-destructive">{nameError}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={255}
              rows={2}
              placeholder="Opcional"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="color">Cor</Label>
            <div className="flex items-center gap-3">
              <Input
                id="color"
                name="color"
                type="color"
                value={form.color}
                onChange={handleChange}
                className="h-9 w-16 cursor-pointer p-1"
              />
              <span className="font-mono text-sm text-muted-foreground uppercase">{form.color}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={handleChange}
              className="size-4 cursor-pointer accent-primary"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Categoria ativa
            </Label>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <LoaderCircle className="animate-spin" />}
              {isEditing ? 'Salvar alterações' : 'Criar categoria'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
