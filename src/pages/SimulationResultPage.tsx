import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '../components/Button'
import { buildFinancialPrompt } from '../services/ai/buildFinancialPrompt'
import { generateFinancialAnalysis } from '../services/ai/gemini'
import type { Simulation } from '../types/Simulation'

const analysisRequests = new Map<string, Promise<string>>()

function requestFinancialAnalysis(
  simulation: Simulation,
) {
  const existingRequest = analysisRequests.get(
    simulation.id,
  )

  if (existingRequest) {
    return existingRequest
  }

  const prompt =
    buildFinancialPrompt(simulation)

  const request =
    generateFinancialAnalysis(
      prompt,
    ).finally(() => {
      analysisRequests.delete(
        simulation.id,
      )
    })

  analysisRequests.set(
    simulation.id,
    request,
  )

  return request
}

function getStoredSimulations(): Simulation[] {
  return JSON.parse(
    localStorage.getItem(
      'finora-simulations',
    ) ?? '[]',
  )
}

export function SimulationResultPage() {
  const { id } = useParams()

  const [simulations, setSimulations] =
    useState<Simulation[]>(
      getStoredSimulations,
    )

  const simulation = simulations.find(
    (item) => item.id === id,
  )

  const [analysis, setAnalysis] =
    useState(
      simulation?.analysis ?? '',
    )

  const [isLoading, setIsLoading] =
    useState(
      () =>
        Boolean(
          simulation &&
            !simulation.analysis,
        ),
    )

  const [error, setError] =
    useState('')

  function saveAnalysis(
    simulationId: string,
    result: string,
  ) {
    setAnalysis(result)

    setSimulations(
      (currentSimulations) => {
        const updatedSimulations =
          currentSimulations.map(
            (item) =>
              item.id ===
              simulationId
                ? {
                    ...item,
                    analysis:
                      result,
                  }
                : item,
          )

        localStorage.setItem(
          'finora-simulations',
          JSON.stringify(
            updatedSimulations,
          ),
        )

        return updatedSimulations
      },
    )
  }

  /*
   * Geração automática da análise.
   *
   * O primeiro setState acontece apenas
   * DEPOIS da Promise ser resolvida.
   *
   * Isso evita o erro:
   * react-hooks/set-state-in-effect
   */
  useEffect(() => {
    if (
      !simulation ||
      simulation.analysis
    ) {
      return
    }

    let cancelled = false

    const simulationId =
      simulation.id

    requestFinancialAnalysis(
      simulation,
    )
      .then((result) => {
        if (cancelled) {
          return
        }

        setAnalysis(result)

        setSimulations(
          (currentSimulations) => {
            const updatedSimulations =
              currentSimulations.map(
                (item) =>
                  item.id ===
                  simulationId
                    ? {
                        ...item,
                        analysis:
                          result,
                      }
                    : item,
              )

            localStorage.setItem(
              'finora-simulations',
              JSON.stringify(
                updatedSimulations,
              ),
            )

            return updatedSimulations
          },
        )
      })
      .catch((error) => {
        if (cancelled) {
          return
        }

        console.error(error)

        setError(
          'Não foi possível gerar a análise financeira. Verifique sua conexão e tente novamente.',
        )
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [simulation])

  /*
   * Tentativa manual.
   *
   * Aqui podemos usar setState antes
   * da requisição porque esta função
   * é chamada pelo clique do usuário,
   * não por um useEffect.
   */
  async function handleRetry() {
    if (!simulation) {
      return
    }

    try {
      setIsLoading(true)
      setError('')

      const result =
        await requestFinancialAnalysis(
          simulation,
        )

      saveAnalysis(
        simulation.id,
        result,
      )
    } catch (error) {
      console.error(error)

      setError(
        'Não foi possível gerar a análise financeira. Verifique sua conexão e tente novamente.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (!simulation) {
    return (
      <main>
        <h1 className="text-2xl font-bold text-foreground">
          Simulação não encontrada
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Não foi possível encontrar
          os dados desta simulação.
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
        Confira abaixo as informações
        da sua simulação.
      </p>

      <div className="mt-8 grid gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Renda mensal
          </p>

          <p className="mt-1 text-lg font-semibold text-foreground">
            {
              simulation.monthlyIncome
            }
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Gastos mensais
          </p>

          <p className="mt-1 text-lg font-semibold text-foreground">
            {
              simulation.monthlyExpenses
            }
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Reserva atual
          </p>

          <p className="mt-1 text-lg font-semibold text-foreground">
            {
              simulation.currentSavings
            }
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Objetivo financeiro
          </p>

          <p className="mt-1 text-lg font-semibold text-foreground">
            {
              simulation.financialGoal
            }
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Valor do objetivo
          </p>

          <p className="mt-1 text-lg font-semibold text-foreground">
            {
              simulation.goalAmount
            }
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">
          Análise da Finora
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Orientações personalizadas
          geradas com Inteligência
          Artificial.
        </p>

        <div className="mt-5 rounded-xl border border-border bg-card p-6">
          {isLoading && (
            <div className="space-y-4">
              <div className="h-5 w-2/3 animate-pulse rounded bg-skeleton-base" />

              <div className="h-4 w-full animate-pulse rounded bg-skeleton-base" />

              <div className="h-4 w-5/6 animate-pulse rounded bg-skeleton-base" />

              <div className="h-4 w-4/6 animate-pulse rounded bg-skeleton-base" />

              <p className="pt-2 text-sm text-muted-foreground">
                A Finora está
                analisando suas
                informações
                financeiras...
              </p>
            </div>
          )}

          {!isLoading &&
            error && (
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Não conseguimos
                  gerar sua análise
                </h3>

                <p className="mt-2 text-sm text-red-500">
                  {error}
                </p>

                <div className="mt-5">
                  <Button
                    type="button"
                    onClick={
                      handleRetry
                    }
                  >
                    Tentar novamente
                  </Button>
                </div>
              </div>
            )}

          {!isLoading &&
            !error &&
            analysis && (
              <div className="text-foreground">
                <ReactMarkdown
                  components={{
                    h1: ({
                      children,
                    }) => (
                      <h1 className="mb-4 mt-6 text-3xl font-bold">
                        {children}
                      </h1>
                    ),

                    h2: ({
                      children,
                    }) => (
                      <h2 className="mb-3 mt-6 text-2xl font-bold">
                        {children}
                      </h2>
                    ),

                    h3: ({
                      children,
                    }) => (
                      <h3 className="mb-3 mt-6 text-xl font-semibold">
                        {children}
                      </h3>
                    ),

                    p: ({
                      children,
                    }) => (
                      <p className="mb-4 leading-7">
                        {children}
                      </p>
                    ),

                    strong: ({
                      children,
                    }) => (
                      <strong className="font-bold">
                        {children}
                      </strong>
                    ),

                    ul: ({
                      children,
                    }) => (
                      <ul className="mb-4 ml-6 list-disc space-y-2">
                        {children}
                      </ul>
                    ),

                    ol: ({
                      children,
                    }) => (
                      <ol className="mb-4 ml-6 list-decimal space-y-2">
                        {children}
                      </ol>
                    ),

                    li: ({
                      children,
                    }) => (
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