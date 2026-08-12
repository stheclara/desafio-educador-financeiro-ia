import { useState } from 'react'
import { Link } from 'react-router-dom'

import type { Simulation } from '../types/Simulation'

export function SimulationHistoryPage() {
  const [simulations, setSimulations] = useState<Simulation[]>(() =>
    JSON.parse(
      localStorage.getItem('finora-simulations') ?? '[]',
    ),
  )

  function handleDelete(id: string) {
    const shouldDelete = window.confirm(
      'Tem certeza que deseja excluir esta simulação? Essa ação não poderá ser desfeita.',
    )

    if (!shouldDelete) {
      return
    }

    const updatedSimulations = simulations.filter(
      (simulation) => simulation.id !== id,
    )

    localStorage.setItem(
      'finora-simulations',
      JSON.stringify(updatedSimulations),
    )

    setSimulations(updatedSimulations)
  }

  if (simulations.length === 0) {
    return (
      <main>
        <h1 className="text-3xl font-semibold text-foreground">
          Histórico de Simulações
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Você ainda não possui simulações salvas.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Criar primeira simulação
        </Link>
      </main>
    )
  }

  const sortedSimulations = [...simulations].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  )

  return (
    <main>
      <h1 className="text-3xl font-semibold text-foreground">
        Histórico de Simulações
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Consulte as simulações financeiras realizadas anteriormente.
      </p>

      <div className="mt-8 grid gap-4">
        {sortedSimulations.map((simulation) => (
          <article
            key={simulation.id}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Objetivo financeiro
                </p>

                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  {simulation.financialGoal}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Valor do objetivo: {simulation.goalAmount}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Criada em:{' '}
                  {new Date(
                    simulation.createdAt,
                  ).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleDelete(simulation.id)}
                  className="inline-flex justify-center rounded-lg border border-red-500 px-4 py-3 font-semibold text-red-500 transition-colors hover:bg-red-500/10"
                >
                  Excluir
                </button>

                <Link
                  to={`/resultado/${simulation.id}`}
                  className="inline-flex justify-center rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Ver resultado
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}