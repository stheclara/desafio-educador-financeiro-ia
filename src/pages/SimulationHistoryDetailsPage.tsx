import ReactMarkdown from 'react-markdown'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import type { Simulation } from '../types/Simulation'

function currencyToNumber(value: string) {
  const normalizedValue = value
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim()

  return Number(normalizedValue) || 0
}

function calculateEstimatedMonths(simulation: Simulation) {
  const income = currencyToNumber(simulation.monthlyIncome)
  const expenses = currencyToNumber(simulation.monthlyExpenses)
  const savings = currencyToNumber(simulation.currentSavings)
  const goalAmount = currencyToNumber(simulation.goalAmount)

  const monthlySavings = income - expenses
  const remainingAmount = Math.max(goalAmount - savings, 0)

  if (remainingAmount === 0) {
    return 0
  }

  if (monthlySavings <= 0) {
    return null
  }

  return Math.ceil(remainingAmount / monthlySavings)
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function SimulationHistoryDetailsPage() {
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
        <Link
          to="/historico"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={18} />
          Voltar ao histórico
        </Link>

        <h1 className="mt-8 text-3xl font-semibold text-foreground">
          Simulação não encontrada
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Não foi possível encontrar os dados desta simulação.
        </p>
      </main>
    )
  }

  const income = currencyToNumber(simulation.monthlyIncome)
  const expenses = currencyToNumber(simulation.monthlyExpenses)

  const monthlySavings = income - expenses

  const estimatedMonths =
    calculateEstimatedMonths(simulation)

  const createdAt = new Date(
    simulation.createdAt,
  ).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <main>
      <Link
        to="/historico"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft size={18} />
        Voltar ao histórico
      </Link>

      <div className="mt-8">
        <p className="text-sm text-muted-foreground">
          Simulação realizada em {createdAt}
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-foreground">
          {simulation.financialGoal}
        </h1>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">
          Resumo financeiro
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              Custo da meta
            </p>

            <p className="mt-1 text-lg font-semibold text-foreground">
              {simulation.goalAmount}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Economia mensal
            </p>

            <p className="mt-1 text-lg font-semibold text-foreground">
              {monthlySavings > 0
                ? formatCurrency(monthlySavings)
                : 'Sem economia mensal'}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Prazo estimado
            </p>

            <p className="mt-1 text-lg font-semibold text-foreground">
              {estimatedMonths === null
                ? 'Não calculável'
                : estimatedMonths === 0
                  ? 'Meta alcançada'
                  : `${estimatedMonths} ${
                      estimatedMonths === 1
                        ? 'mês'
                        : 'meses'
                    }`}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">
          Análise da Finora
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Insights gerados para esta simulação.
        </p>

        <div className="mt-5 rounded-xl border border-border bg-card p-6">
          {simulation.analysis ? (
            <div className="text-foreground">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-4 mt-6 text-3xl font-bold">
                      {children}
                    </h1>
                  ),

                  h2: ({ children }) => (
                    <h2 className="mb-3 mt-6 text-2xl font-bold">
                      {children}
                    </h2>
                  ),

                  h3: ({ children }) => (
                    <h3 className="mb-3 mt-6 text-xl font-semibold">
                      {children}
                    </h3>
                  ),

                  p: ({ children }) => (
                    <p className="mb-4 leading-7">
                      {children}
                    </p>
                  ),

                  strong: ({ children }) => (
                    <strong className="font-bold">
                      {children}
                    </strong>
                  ),

                  ul: ({ children }) => (
                    <ul className="mb-4 ml-6 list-disc space-y-2">
                      {children}
                    </ul>
                  ),

                  ol: ({ children }) => (
                    <ol className="mb-4 ml-6 list-decimal space-y-2">
                      {children}
                    </ol>
                  ),

                  li: ({ children }) => (
                    <li className="leading-7">
                      {children}
                    </li>
                  ),

                  hr: () => (
                    <hr className="my-6 border-border" />
                  ),
                }}
              >
                {simulation.analysis}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Esta simulação ainda não possui uma análise salva.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}