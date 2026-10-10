import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Send } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

import { useParams } from 'react-router-dom'

import { Button } from '../components/Button'
import { buildChatPrompt } from '../services/ai/buildChatPrompt'
import { buildFinancialPrompt } from '../services/ai/buildFinancialPrompt'
import {
  generateChatResponse,
  generateFinancialAnalysis,
} from '../services/ai/gemini'
import type {
  ChatMessage,
  Simulation,
} from '../types/Simulation'

const analysisRequests = new Map<
  string,
  Promise<string>
>()

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

const markdownComponents = {
  h1: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <h1 className="mb-4 mt-6 text-3xl font-bold">
      {children}
    </h1>
  ),

  h2: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <h2 className="mb-3 mt-6 text-2xl font-bold">
      {children}
    </h2>
  ),

  h3: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <h3 className="mb-3 mt-6 text-xl font-semibold">
      {children}
    </h3>
  ),

  p: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <p className="mb-4 leading-7 last:mb-0">
      {children}
    </p>
  ),

  strong: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <strong className="font-bold">
      {children}
    </strong>
  ),

  ul: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2">
      {children}
    </ul>
  ),

  ol: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2">
      {children}
    </ol>
  ),

  li: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <li className="leading-7">
      {children}
    </li>
  ),

  hr: () => (
    <hr className="my-6 border-border" />
  ),

  table: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <div className="my-5 w-full">
      <table className="block w-full text-sm sm:table sm:border-collapse sm:overflow-hidden sm:rounded-lg sm:border sm:border-border">
        {children}
      </table>
    </div>
  ),

  thead: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <thead className="hidden bg-muted sm:table-header-group">
      {children}
    </thead>
  ),

  tbody: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <tbody className="block space-y-4 sm:table-row-group sm:space-y-0">
      {children}
    </tbody>
  ),

  tr: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <tr className="block overflow-hidden rounded-xl border border-border bg-background sm:table-row sm:rounded-none sm:border-0 sm:bg-transparent">
      {children}
    </tr>
  ),

  th: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <th className="hidden border-r border-border px-4 py-3 text-left font-semibold last:border-r-0 sm:table-cell">
      {children}
    </th>
  ),

  td: ({
    children,
  }: {
    children?: ReactNode
  }) => (
    <td className="block border-b border-border px-4 py-3 leading-6 last:border-b-0 sm:table-cell sm:border-b-0 sm:border-r sm:align-top sm:last:border-r-0">
      {children}
    </td>
  ),
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

  const [question, setQuestion] =
    useState('')

  const [isSending, setIsSending] =
    useState(false)

  const [chatError, setChatError] =
    useState('')

  const chatEndRef =
    useRef<HTMLDivElement>(null)

  const chatHistory =
    simulation?.chatHistory ?? []

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [
    simulation?.chatHistory?.length,
    isSending,
  ])

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

  async function handleSendQuestion() {
    if (!simulation) {
      return
    }

    const trimmedQuestion =
      question.trim()

    if (
      !trimmedQuestion ||
      isSending
    ) {
      return
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedQuestion,
      createdAt: new Date().toISOString(),
    }

    const currentChatHistory =
      simulation.chatHistory ?? []

    const historyWithQuestion = [
      ...currentChatHistory,
      userMessage,
    ]

    const simulationsWithQuestion =
      simulations.map((item) =>
        item.id === simulation.id
          ? {
              ...item,
              chatHistory:
                historyWithQuestion,
            }
          : item,
      )

    setSimulations(
      simulationsWithQuestion,
    )

    localStorage.setItem(
      'finora-simulations',
      JSON.stringify(
        simulationsWithQuestion,
      ),
    )

    setQuestion('')
    setChatError('')
    setIsSending(true)

    try {
      const prompt = buildChatPrompt(
        simulation,
        trimmedQuestion,
        currentChatHistory,
      )

      const response =
        await generateChatResponse(
          prompt,
        )

      if (!response.trim()) {
        throw new Error(
          'A IA retornou uma resposta vazia.',
        )
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        createdAt: new Date().toISOString(),
      }

      const completeHistory = [
        ...historyWithQuestion,
        assistantMessage,
      ]

      const updatedSimulations =
        simulationsWithQuestion.map(
          (item) =>
            item.id ===
            simulation.id
              ? {
                  ...item,
                  chatHistory:
                    completeHistory,
                }
              : item,
        )

      setSimulations(
        updatedSimulations,
      )

      localStorage.setItem(
        'finora-simulations',
        JSON.stringify(
          updatedSimulations,
        ),
      )
    } catch (error) {
      console.error(error)

      setChatError(
        'Não foi possível responder à sua pergunta neste momento. Tente novamente.',
      )
    } finally {
      setIsSending(false)
    }
  }

  function handleQuestionKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault()

      void handleSendQuestion()
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Profissão
          </p>

          <p className="mt-1 break-words text-lg font-semibold text-foreground">
            {simulation.profession ||
              'Não informado'}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Hobbies
          </p>

          <p className="mt-1 break-words text-lg font-semibold text-foreground">
            {simulation.hobbies ||
              'Não informado'}
          </p>
        </div>

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

        <div className="rounded-xl border border-border bg-card p-5 sm:col-span-2">
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
          Orientações personalizadas
          geradas com Inteligência
          Artificial.
        </p>

        <div className="mt-5 min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
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
              <div className="min-w-0 break-words text-foreground">
                <ReactMarkdown
                  remarkPlugins={[
                    remarkGfm,
                  ]}
                  components={
                    markdownComponents
                  }
                >
                  {analysis}
                </ReactMarkdown>
              </div>
            )}
        </div>
      </section>

      {!isLoading &&
        !error &&
        analysis && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-foreground">
              Converse com a Finora
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Faça perguntas sobre esta
              simulação e continue seu
              planejamento financeiro.
            </p>

            <div className="mt-5 min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
              {chatHistory.length === 0 ? (
                <div className="rounded-lg bg-primary/10 p-4">
                  <p className="text-sm leading-6 text-foreground">
                    Sua análise está
                    pronta! Agora você
                    pode conversar com a
                    Finora sobre o
                    resultado, tirar
                    dúvidas ou perguntar
                    como alcançar sua
                    meta.
                  </p>
                </div>
              ) : (
                <div className="min-w-0 space-y-6">
                  {chatHistory.map(
                    (message) => (
                      <div
                        key={
                          message.id
                        }
                        className={
                          message.role ===
                          'user'
                            ? 'ml-auto w-full max-w-2xl break-words rounded-xl bg-primary px-4 py-4 text-primary-foreground sm:w-auto sm:px-5'
                            : 'mr-auto w-full max-w-2xl break-words rounded-xl border border-border bg-background px-4 py-4 text-foreground sm:w-auto sm:px-5'
                        }
                      >
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
                          {message.role ===
                          'user'
                            ? 'Você'
                            : 'Finora'}
                        </p>

                        {message.role ===
                        'assistant' ? (
                          <ReactMarkdown
                            remarkPlugins={[
                              remarkGfm,
                            ]}
                            components={
                              markdownComponents
                            }
                          >
                            {
                              message.content
                            }
                          </ReactMarkdown>
                        ) : (
                          <p className="leading-7">
                            {
                              message.content
                            }
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}

              {isSending && (
                <div className="mt-6 mr-auto w-full max-w-2xl rounded-xl border border-border bg-background px-4 py-4 sm:w-auto sm:px-5">
                  <p className="text-sm font-medium text-foreground">
                    Finora
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Analisando sua
                    pergunta...
                  </p>
                </div>
              )}

              {chatError && (
                <div
                  role="alert"
                  className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4"
                >
                  <p className="text-sm text-red-500">
                    {chatError}
                  </p>
                </div>
              )}

              <div ref={chatEndRef} />

              <div className="mt-6 border-t border-border pt-6">
                <label
                  htmlFor="finora-question"
                  className="text-sm font-medium text-foreground"
                >
                  Sua pergunta
                </label>

                <textarea
                  id="finora-question"
                  value={question}
                  onChange={(event) =>
                    setQuestion(
                      event.target.value,
                    )
                  }
                  onKeyDown={
                    handleQuestionKeyDown
                  }
                  placeholder="Ex.: Como posso atingir essa meta mais rápido?"
                  rows={4}
                  disabled={isSending}
                  className="mt-2 w-full resize-none rounded-xl border border-border bg-input px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Enter para enviar •
                    Shift + Enter para
                    quebrar a linha
                  </p>

                  <Button
                    type="button"
                    onClick={
                      handleSendQuestion
                    }
                    disabled={
                      question.trim() ===
                        '' ||
                      isSending
                    }
                  >
                    <span className="inline-flex items-center gap-2">
                      <Send
                        size={17}
                      />

                      {isSending
                        ? 'Enviando...'
                        : 'Enviar pergunta'}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
    </main>
  )
}