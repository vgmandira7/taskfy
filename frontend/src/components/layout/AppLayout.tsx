import { CheckCheck, ListChecks, Tags } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'

import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/', label: 'Tarefas', icon: ListChecks, end: true },
  { to: '/categorias', label: 'Categorias', icon: Tags, end: false },
]

/** Layout compartilhado: barra superior com título e navegação + área da página (Outlet). */
export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <CheckCheck className="size-4" />
            </span>
            Taskfy
          </Link>

          <nav className="flex items-center gap-1" aria-label="Navegação principal">
            {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        Taskfy · LDW AT2 — React, TypeScript e shadcn/ui
      </footer>
    </div>
  )
}
