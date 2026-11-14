import { CircleCheck, Clock, ListChecks, LoaderCircle, type LucideIcon } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { isOverdue } from '@/lib/date'
import type { Task } from '@/types/task'

interface StatCardProps {
  label: string
  value: number
  hint: string
  icon: LucideIcon
  loading: boolean
}

function StatCard({ label, value, hint, icon: Icon, loading }: StatCardProps) {
  return (
    <Card className="gap-3 py-5">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardDescription className="font-medium">{label}</CardDescription>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
        )}
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

interface TaskStatsProps {
  tasks: Task[]
  loading: boolean
}

/** Métricas resumidas do dashboard (contadores calculados a partir da lista da API). */
export function TaskStats({ tasks, loading }: TaskStatsProps) {
  const total = tasks.length
  const pending = tasks.filter((t) => t.status === 'pending').length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const done = tasks.filter((t) => t.status === 'done').length
  const overdue = tasks.filter(isOverdue).length

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Total"
        value={total}
        hint={overdue > 0 ? `${overdue} em atraso` : 'Nenhuma em atraso'}
        icon={ListChecks}
        loading={loading}
      />
      <StatCard label="Pendentes" value={pending} hint="Aguardando início" icon={Clock} loading={loading} />
      <StatCard
        label="Em andamento"
        value={inProgress}
        hint="Sendo executadas"
        icon={LoaderCircle}
        loading={loading}
      />
      <StatCard label="Concluídas" value={done} hint="Finalizadas" icon={CircleCheck} loading={loading} />
    </div>
  )
}
