import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Send } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '../components/Button'
import { buildChatPrompt } from '../services/ai/buildChatPrompt'
import { generateChatResponse } from '../services/ai/gemini'
import type {
  ChatMessage,
  Simulation,
} from '../types/Simulation'

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
  const remainingAmount = Math.max(
    goalAmount - savings,
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

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mb-4 mt-6 text-3xl font-bold">
      {children}
    </h1>
  ),

  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mb-3 mt-6 text-2xl font-bold">
      {children}
    </h2>
  ),

  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mb-3 mt-6 text-xl font-semibold">
      {children}
    </h3>
  ),

  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-4 leading-7 last:mb-0">
      {children}
    </p>
  ),

  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-bold">
      {children}
    </strong>
  ),

  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2">
      {children}
    </ul>
  ),

  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2">
      {children}
    </ol>
  ),

  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-7">
      {children}
    </li>
  ),

  hr: () => (
    <hr className="my-6 border-border" />
  ),

  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-5 overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-muted">
      {children}
    </thead>
  ),

  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody>
      {children}
    </tbody>
  ),

  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="border-b border-border last:border-b-0">
      {children}
    </tr>
  ),

  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="border-r border-border px-4 py-3 text-left font-semibold last:border-r-0">
      {children}
    </th>
  ),

  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="border-r border-border px-4 py-3 align-top last:border-r-0">
      {children}
    </td>
  ),
}

export function SimulationHistoryDetailsPage() {
  const { id } = useParams()

  const [simulations, setSimulations] =
    useState<Simulation[]>(() =>
      JSON.parse(
        localStorage.getItem(
          'finora-simulations',
        ) ?? '[]',
      ),
    )

  const [question, setQuestion] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [chatError, setChatError] = useState('')

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

  const income = currencyToNumber(
    simulation.monthlyIncome,
  )

  const expenses = currencyToNumber(
    simulation.monthlyExpenses,
  )

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

  const chatHistory =
    simulation.chatHistory ?? []

  async function handleSendQuestion() {
    const trimmedQuestion = question.trim()

    if (!trimmedQuestion || isSending) {
      return
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedQuestion,
      createdAt: new Date().toISOString(),
    }

    const historyWithQuestion = [
      ...chatHistory,
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
        chatHistory,
      )

      const response =
        await generateChatResponse(prompt)

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
            item.id === simulation.id
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
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault()

      void handleSendQuestion()
    }
  }

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
                ? formatCurrency(
                    monthlySavings,
                  )
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
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
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

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">
          Converse com a Finora
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Faça perguntas sobre esta simulação e continue
          seu planejamento financeiro.
        </p>

        <div className="mt-5 rounded-xl border border-border bg-card p-6">
          {chatHistory.length === 0 ? (
            <div className="rounded-lg bg-primary/10 p-4">
              <p className="text-sm leading-6 text-foreground">
                Você ainda não fez nenhuma pergunta sobre
                esta simulação. Pergunte, por exemplo, como
                alcançar sua meta mais rápido ou como uma
                mudança nos gastos pode alterar o prazo.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === 'user'
                      ? 'ml-auto max-w-2xl rounded-xl bg-primary px-5 py-4 text-primary-foreground'
                      : 'mr-auto max-w-2xl rounded-xl border border-border bg-background px-5 py-4 text-foreground'
                  }
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
                    {message.role === 'user'
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
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="leading-7">
                      {message.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {isSending && (
            <div className="mt-6 mr-auto max-w-2xl rounded-xl border border-border bg-background px-5 py-4">
              <p className="text-sm font-medium text-foreground">
                Finora
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Analisando sua pergunta...
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
                Enter para enviar • Shift + Enter para
                quebrar a linha
              </p>

              <Button
                type="button"
                onClick={
                  handleSendQuestion
                }
                disabled={
                  question.trim() === '' ||
                  isSending
                }
              >
                <span className="inline-flex items-center gap-2">
                  <Send size={17} />

                  {isSending
                    ? 'Enviando...'
                    : 'Enviar pergunta'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}