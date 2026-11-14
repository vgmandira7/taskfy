import { CalendarDays, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, isOverdue } from '@/lib/date'
import { cn } from '@/lib/utils'
import { STATUS_LABELS, TASK_STATUS_VALUES, type Task, type TaskStatus } from '@/types/task'

import { CategoryBadge, PriorityBadge } from './TaskBadges'

interface TaskTableProps {
  tasks: Task[]
  /** Quando true, mostra linhas de esqueleto no lugar dos dados. */
  loading?: boolean
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange: (task: Task, status: TaskStatus) => void
}

const HEADERS = ['Tarefa', 'Categoria', 'Prioridade', 'Status', 'Prazo', ''] as const

export function TaskTable({ tasks, loading = false, onEdit, onDelete, onStatusChange }: TaskTableProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            {HEADERS.map((header, index) => (
              <TableHead key={index} className={cn('px-4', index === HEADERS.length - 1 && 'w-24')}>
                {header === '' ? <span className="sr-only">Ações</span> : header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, row) => (
                <TableRow key={row} className="hover:bg-transparent">
                  {HEADERS.map((_header, col) => (
                    <TableCell key={col} className="px-4 py-4">
                      <Skeleton className="h-5 w-full max-w-[140px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : tasks.map((task) => {
                const overdue = isOverdue(task)

                return (
                  <TableRow key={task.id}>
                    <TableCell className="max-w-[280px] px-4 py-3">
                      <p
                        className={cn(
                          'truncate font-medium',
                          task.status === 'done' && 'text-muted-foreground line-through',
                        )}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="truncate text-xs text-muted-foreground">{task.description}</p>
                      )}
                    </TableCell>

                    <TableCell className="px-4">
                      <CategoryBadge category={task.category} />
                    </TableCell>

                    <TableCell className="px-4">
                      <PriorityBadge priority={task.priority} />
                    </TableCell>

                    <TableCell className="px-4">
                      <Select
                        value={task.status}
                        onValueChange={(value) => onStatusChange(task, value as TaskStatus)}
                      >
                        <SelectTrigger size="sm" className="w-[140px]" aria-label="Alterar status">
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
                    </TableCell>

                    <TableCell className="px-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 text-sm whitespace-nowrap',
                          overdue ? 'font-medium text-destructive' : 'text-muted-foreground',
                        )}
                      >
                        <CalendarDays className="size-3.5" />
                        {formatDate(task.dueDate)}
                        {overdue && <span className="text-xs">(atrasada)</span>}
                      </span>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(task)}
                          aria-label={`Editar tarefa ${task.title}`}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onDelete(task)}
                          aria-label={`Excluir tarefa ${task.title}`}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
        </TableBody>
      </Table>
    </Card>
  )
}
