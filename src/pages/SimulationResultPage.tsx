import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { buildFinancialPrompt } from '../services/ai/buildFinancialPrompt'
import { generateFinancialAnalysis } from '../services/ai/gemini'
import type { Simulation } from '../types/Simulation'

export function SimulationResultPage() {
  const { id } = useParams()

  const simulations: Simulation[] = JSON.parse(
    localStorage.getItem('finora-simulations') ?? '[]',
  )

  const simulation = simulations.find(
    (item) => item.id === id,
  )

  const [analysis, setAnalysis] = useState(
    simulation?.analysis ?? '',
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!simulation) {
      return
    }

    if (simulation.analysis) {
      setAnalysis(simulation.analysis)
      return
    }

    let cancelled = false

    async function generateAnalysis() {
      try {
        setIsLoading(true)
        setError('')

        const prompt = buildFinancialPrompt(simulation)

        const result = await generateFinancialAnalysis(prompt)

        if (cancelled) {
          return
        }

        setAnalysis(result)

        const updatedSimulations = simulations.map((item) =>
          item.id === simulation.id
            ? {
                ...item,
                analysis: result,
              }
            : item,
        )

        localStorage.setItem(
          'finora-simulations',
          JSON.stringify(updatedSimulations),
        )
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(error)

        setError(
          'Não foi possível gerar a análise financeira neste momento.',
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    generateAnalysis()

    return () => {
      cancelled = true
    }
  }, [id])

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

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">
          Análise da Finora
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Orientações personalizadas geradas com Inteligência Artificial.
        </p>

        <div className="mt-5 rounded-xl border border-border bg-card p-6">
          {isLoading && (
            <p className="text-muted-foreground">
              Analisando suas informações financeiras...
            </p>
          )}

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {!isLoading && !error && analysis && (
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
                {analysis}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}