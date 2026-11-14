import { Toaster as Sonner, type ToasterProps } from 'sonner'

/**
 * Wrapper do Sonner (shadcn/ui). Montado uma única vez na raiz da aplicação (App.tsx)
 * e acionado em qualquer lugar com toast.success(...) / toast.error(...).
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
