import { useMemo, useState } from 'react'
import { ClipboardList, Plus, Search, SearchX, X } from 'lucide-react'

import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { PageHeader } from '@/components/shared/PageHeader'
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog'
import { TaskStats } from '@/components/tasks/TaskStats'
import { TaskTable } from '@/components/tasks/TaskTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCategories } from '@/hooks/useCategories'
import { useTasks } from '@/hooks/useTasks'
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITY_VALUES,
  TASK_STATUS_VALUES,
  type Task,
  type TaskPayload,
  type TaskStatus,
} from '@/types/task'

/** Valor sentinela do "Todos" nos filtros (Select do Radix não aceita value vazio). */
const ALL = 'all'

export default function DashboardPage() {
  const { tasks, loading, error, reload, create, update, changeStatus, remove } = useTasks()
  const { categories } = useCategories()

  // Filtros (aplicados no cliente sobre a lista retornada pela API)
  const [search, setSearch] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>(ALL)
  const [priorityFilter, setPriorityFilter] = useState<string>(ALL)
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL)

  // Modais
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [deleting, setDeleting] = useState<boolean>(false)

  const hasFilters =
    search !== '' || statusFilter !== ALL || priorityFilter !== ALL || categoryFilter !== ALL

  const filteredTasks = useMemo(() => {
    const term = search.trim().toLowerCase()

    return tasks.filter((task) => {
      if (term !== '' && !task.title.toLowerCase().includes(term)) return false
      if (statusFilter !== ALL && task.status !== statusFilter) return false
      if (priorityFilter !== ALL && task.priority !== priorityFilter) return false
      if (categoryFilter !== ALL && String(task.categoryId) !== categoryFilter) return false
      return true
    })
  }, [tasks, search, statusFilter, priorityFilter, categoryFilter])

  const clearFilters = (): void => {
    setSearch('')
    setStatusFilter(ALL)
    setPriorityFilter(ALL)
    setCategoryFilter(ALL)
  }

  const openCreate = (): void => {
    setEditingTask(null)
    setFormOpen(true)
  }

  const openEdit = (task: Task): void => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const handleSubmit = (payload: TaskPayload): Promise<boolean> =>
    editingTask ? update(editingTask.id, payload) : create(payload)

  const handleStatusChange = (task: Task, status: TaskStatus): void => {
    if (status !== task.status) void changeStatus(task.id, status)
  }

  const handleConfirmDelete = async (): Promise<void> => {
    if (!taskToDelete) return
    setDeleting(true)
    const success = await remove(taskToDelete.id)
    setDeleting(false)
    if (success) setTaskToDelete(null)
  }

  const newTaskButton = (
    <Button onClick={openCreate}>
      <Plus />
      Nova tarefa
    </Button>
  )

  function renderContent() {
    if (error) return <ErrorState message={error} onRetry={() => void reload()} />

    if (loading) {
      return (
        <TaskTable
          tasks={[]}
          loading
          onEdit={openEdit}
          onDelete={setTaskToDelete}
          onStatusChange={handleStatusChange}
        />
      )
    }

    if (tasks.length === 0) {
      return (
        <EmptyState
          icon={ClipboardList}
          title="Nenhuma tarefa por aqui ainda"
          description="Crie sua primeira tarefa para começar a organizar seus compromissos."
          action={newTaskButton}
        />
      )
    }

    if (filteredTasks.length === 0) {
      return (
        <EmptyState
          icon={SearchX}
          title="Nenhuma tarefa encontrada"
          description="Nenhuma tarefa corresponde aos filtros selecionados."
          action={
            <Button variant="outline" onClick={clearFilters}>
              <X />
              Limpar filtros
            </Button>
          }
        />
      )
    }

    return (
      <TaskTable
        tasks={filteredTasks}
        onEdit={openEdit}
        onDelete={setTaskToDelete}
        onStatusChange={handleStatusChange}
      />
    )
  }

  return (
    <>
      <PageHeader
        title="Minhas tarefas"
        description="Acompanhe o andamento, os prazos e as prioridades das suas tarefas."
        action={newTaskButton}
      />

      <TaskStats tasks={tasks} loading={loading} />

      {/* Filtros */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Buscar por título..."
            className="pl-9"
            aria-label="Buscar tarefas por título"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[160px]" aria-label="Filtrar por status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos os status</SelectItem>
            {TASK_STATUS_VALUES.map((value) => (
              <SelectItem key={value} value={value}>
                {STATUS_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full md:w-[170px]" aria-label="Filtrar por prioridade">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas as prioridades</SelectItem>
            {TASK_PRIORITY_VALUES.map((value) => (
              <SelectItem key={value} value={value}>
                {PRIORITY_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]" aria-label="Filtrar por categoria">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            <X />
            Limpar
          </Button>
        )}
      </div>

      {renderContent()}

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editingTask}
        categories={categories}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={taskToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setTaskToDelete(null)
        }}
        title="Excluir tarefa?"
        description={`A tarefa "${taskToDelete?.title ?? ''}" será removida permanentemente. Essa ação não pode ser desfeita.`}
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </>
  )
}
