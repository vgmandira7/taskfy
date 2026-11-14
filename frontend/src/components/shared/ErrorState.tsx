import { RefreshCw, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

/** Exibido quando a comunicação com a API falha (ex.: backend desligado). */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card className="border-destructive/40">
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold">Falha na comunicação com a API</h3>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{message}</p>
        </div>
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw />
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  )
}
