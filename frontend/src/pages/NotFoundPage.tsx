import { SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <EmptyState
      icon={SearchX}
      title="Página não encontrada"
      description="O endereço que você tentou acessar não existe."
      action={
        <Button asChild>
          <Link to="/">Voltar para as tarefas</Link>
        </Button>
      }
    />
  )
}
