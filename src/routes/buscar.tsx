import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/buscar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/busca"!</div>
}
