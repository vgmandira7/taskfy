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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Category } from '@/types/category'
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITY_VALUES,
  TASK_STATUS_VALUES,
  type Task,
  type TaskPayload,
  type TaskPriority,
  type TaskStatus,
} from '@/types/task'

/** O Select do Radix não aceita value vazio, então usamos um valor sentinela. */
const NO_CATEGORY = 'none'

interface TaskFormState {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  categoryId: string
}

const EMPTY_FORM: TaskFormState = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
  categoryId: NO_CATEGORY,
}

function toFormState(task: Task | null): TaskFormState {
  if (!task) return EMPTY_FORM
  return {
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    categoryId: task.categoryId === null ? NO_CATEGORY : String(task.categoryId),
  }
}

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null = modo cadastro; Task = modo edição */
  task: Task | null
  categories: Category[]
  /** Retorna true quando a API aceitou os dados (o modal então fecha). */
  onSubmit: (payload: TaskPayload) => Promise<boolean>
}

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
  categories,
  onSubmit,
}: TaskFormDialogProps) {
  const [form, setForm] = useState<TaskFormState>(EMPTY_FORM)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const isEditing = task !== null

  // Sempre que o modal abre, carrega os dados da tarefa (edição) ou limpa o formulário (cadastro)
  useEffect(() => {
    if (open) {
      setForm(toFormState(task))
      setTitleError(null)
    }
  }, [open, task])

  // Categorias inativas só aparecem se forem a categoria atual da tarefa
  const categoryOptions = categories.filter((c) => c.isActive || c.id === task?.categoryId)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'title') setTitleError(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (form.title.trim() === '') {
      setTitleError('Informe o título da tarefa.')
      return
    }

    const payload: TaskPayload = {
      title: form.title.trim(),
      description: form.description.trim() === '' ? null : form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate === '' ? null : form.dueDate,
      categoryId: form.categoryId === NO_CATEGORY ? null : Number(form.categoryId),
    }

    setSubmitting(true)
    const success = await onSubmit(payload)
    setSubmitting(false)

    if (success) onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar tarefa' : 'Nova tarefa'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere os dados da tarefa e salve para atualizar.'
              : 'Preencha os dados para cadastrar uma nova tarefa.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={150}
              placeholder="Ex.: Entregar relatório de LDW"
              aria-invalid={titleError !== null}
              autoFocus
            />
            {titleError && <p className="text-sm text-destructive">{titleError}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Detalhes opcionais sobre a tarefa"
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={form.priority}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, priority: value as TaskPriority }))
                }
              >
                <SelectTrigger id="priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITY_VALUES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {PRIORITY_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, status: value as TaskStatus }))
                }
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUS_VALUES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {STATUS_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Prazo</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="categoryId">Categoria</Label>
              <Select
                value={form.categoryId}
                onValueChange={(value) => setForm((prev) => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger id="categoryId" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CATEGORY}>Sem categoria</SelectItem>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              {isEditing ? 'Salvar alterações' : 'Criar tarefa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
