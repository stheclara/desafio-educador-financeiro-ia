import { useState } from 'react'
import {
  CalendarDays,
  ChevronRight,
  Target,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Simulation } from '../types/Simulation'

function currencyToNumber(value: string) {
  const normalizedValue = value
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim()

  return Number(normalizedValue) || 0
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function calculateMonthlySavings(simulation: Simulation) {
  const income = currencyToNumber(simulation.monthlyIncome)
  const expenses = currencyToNumber(simulation.monthlyExpenses)

  return income - expenses
}

function calculateEstimatedMonths(simulation: Simulation) {
  const monthlySavings = calculateMonthlySavings(simulation)

  const currentSavings = currencyToNumber(
    simulation.currentSavings,
  )

  const goalAmount = currencyToNumber(
    simulation.goalAmount,
  )

  const remainingAmount = Math.max(
    goalAmount - currentSavings,
    0,
  )

  if (remainingAmount === 0) {
    return 0
  }

  if (monthlySavings <= 0) {
    return null
  }

  return Math.ceil(
    remainingAmount / monthlySavings,
  )
}

export function SimulationHistoryPage() {
  const [simulations, setSimulations] =
    useState<Simulation[]>(() =>
      JSON.parse(
        localStorage.getItem(
          'finora-simulations',
        ) ?? '[]',
      ),
    )

  function handleDelete(id: string) {
    const shouldDelete = window.confirm(
      'Tem certeza que deseja excluir esta simulação? Essa ação não poderá ser desfeita.',
    )

    if (!shouldDelete) {
      return
    }

    const updatedSimulations =
      simulations.filter(
        (simulation) =>
          simulation.id !== id,
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

        <div className="mt-8 rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <Target
            size={40}
            className="mx-auto text-primary"
          />

          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Nenhuma simulação encontrada
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Crie sua primeira simulação financeira
            para acompanhar seus objetivos e consultar
            suas análises posteriormente.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Criar primeira simulação
          </Link>
        </div>
      </main>
    )
  }

  const sortedSimulations = [
    ...simulations,
  ].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  )

  return (
    <main>
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Histórico de Simulações
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Acompanhe seus objetivos financeiros e
          consulte suas análises anteriores.
        </p>
      </div>

      <div className="mt-8 grid gap-4">
        {sortedSimulations.map(
          (simulation) => {
            const monthlySavings =
              calculateMonthlySavings(
                simulation,
              )

            const estimatedMonths =
              calculateEstimatedMonths(
                simulation,
              )

            const createdAt = new Date(
              simulation.createdAt,
            ).toLocaleDateString(
              'pt-BR',
              {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              },
            )

            return (
              <article
                key={simulation.id}
                className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
              >
                <div className="grid gap-6 lg:grid-cols-[minmax(220px,1.5fr)_repeat(3,minmax(120px,1fr))_auto] lg:items-center">
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Target size={20} />
                      </div>

                      <div>
                        <h2 className="font-semibold text-foreground">
                          {
                            simulation.financialGoal
                          }
                        </h2>

                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <CalendarDays
                            size={14}
                          />

                          {createdAt}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Custo da meta
                    </p>

                    <p className="mt-1 font-semibold text-foreground">
                      {simulation.goalAmount}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Prazo estimado
                    </p>

                    <p className="mt-1 font-semibold text-foreground">
                      {estimatedMonths ===
                      null
                        ? 'Não calculável'
                        : estimatedMonths ===
                            0
                          ? 'Meta alcançada'
                          : `${estimatedMonths} ${
                              estimatedMonths ===
                              1
                                ? 'mês'
                                : 'meses'
                            }`}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Economia mensal
                    </p>

                    <p className="mt-1 font-semibold text-foreground">
                      {monthlySavings > 0
                        ? formatCurrency(
                            monthlySavings,
                          )
                        : 'Sem economia'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          simulation.id,
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-red-500 hover:bg-red-500/10 hover:text-red-500"
                      aria-label={`Excluir simulação ${simulation.financialGoal}`}
                      title="Excluir simulação"
                    >
                      <Trash2 size={18} />
                    </button>

                    <Link
                      to={`/historico/${simulation.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Ver detalhes
                      <ChevronRight
                        size={17}
                      />
                    </Link>
                  </div>
                </div>
              </article>
            )
          },
        )}
      </div>
    </main>
  )
}