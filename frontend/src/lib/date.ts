import type { Task } from '@/types/task'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Data de hoje (fuso local) no formato AAAA-MM-DD, o mesmo usado pela API. */
export function todayISO(): string {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** Converte AAAA-MM-DD em DD/MM/AAAA sem passar por Date (evita erro de fuso horário). */
export function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const [year, month, day] = iso.slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}

/** Tarefa atrasada = tem prazo vencido e ainda não foi concluída. */
export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'done') return false
  return task.dueDate.slice(0, 10) < todayISO()
}
