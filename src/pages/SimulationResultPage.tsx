import { useParams } from 'react-router-dom'

import type { Simulation } from '../types/Simulation'

export function SimulationResultPage() {
  const { id } = useParams()

  const simulations: Simulation[] = JSON.parse(
    localStorage.getItem('finora-simulations') ?? '[]',
  )

  const simulation = simulations.find(
    (item) => item.id === id,
  )

  if (!simulation) {
    return (
      <main>
        <h1 className="text-2xl font-bold text-foreground">
          Simulação não encontrada
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Não foi possível encontrar os dados desta simulação.
        </p>
      </main>
    )
  }

  return (
    <main>
      <h1 className="text-3xl font-semibold text-foreground">
        Resultado da Simulação
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Confira abaixo as informações da sua simulação.
      </p>

      <div className="mt-8 grid gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Renda mensal
          </p>

          <p className="mt-1 text-lg font-semibold text-foreground">
            {simulation.monthlyIncome}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Gastos mensais
          </p>

          <p className="mt-1 text-lg font-semibold text-foreground">
            {simulation.monthlyExpenses}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Reserva atual
          </p>

          <p className="mt-1 text-lg font-semibold text-foreground">
            {simulation.currentSavings}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Objetivo financeiro
          </p>

          <p className="mt-1 text-lg font-semibold text-foreground">
            {simulation.financialGoal}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Valor do objetivo
          </p>

          <p className="mt-1 text-lg font-semibold text-foreground">
            {simulation.goalAmount}
          </p>
        </div>
      </div>
    </main>
  )
}