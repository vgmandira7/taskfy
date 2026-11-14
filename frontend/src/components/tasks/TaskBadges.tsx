import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/category'
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  type TaskPriority,
  type TaskStatus,
} from '@/types/task'

const STATUS_STYLES: Record<TaskStatus, string> = {
  pending: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  in_progress: 'border-transparent bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300',
  done: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
}

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: 'border-transparent bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
  medium: 'border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300',
  high: 'border-transparent bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Badge className={cn(STATUS_STYLES[status])}>{STATUS_LABELS[status]}</Badge>
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge className={cn(PRIORITY_STYLES[priority])}>{PRIORITY_LABELS[priority]}</Badge>
}

export function CategoryBadge({ category }: { category: Category | null }) {
  if (!category) {
    return <span className="text-sm text-muted-foreground">Sem categoria</span>
  }

  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        className="size-2 rounded-full"
        style={{ backgroundColor: category.color }}
        aria-hidden="true"
      />
      {category.name}
    </Badge>
  )
}
