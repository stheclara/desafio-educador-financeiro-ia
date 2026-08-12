import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../components/Button'
import { FormStep } from '../components/FormStep'
import { Input } from '../components/Input'
import { ProgressBar } from '../components/ProgressBar'
import type { SimulationData } from '../types/Simulation'
import { formatCurrency } from '../utils/formatCurrency'

const TOTAL_STEPS = 5

const initialData: SimulationData = {
  monthlyIncome: '',
  monthlyExpenses: '',
  currentSavings: '',
  financialGoal: '',
  goalAmount: '',
}

export function SimulationFormPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<SimulationData>(initialData)

  const navigate = useNavigate()

  function handleNextStep() {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((step) => step + 1)
    }
  }

  function handlePreviousStep() {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1)
    }
  }

  function handleCurrencyChange(
    field: keyof SimulationData,
    value: string,
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: formatCurrency(value),
    }))
  }

  function handleTextChange(
    field: keyof SimulationData,
    value: string,
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }))
  }

  function handleFinish() {
    const simulation = {
      ...formData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    const simulations = JSON.parse(
      localStorage.getItem('finora-simulations') ?? '[]',
    )

    simulations.push(simulation)

    localStorage.setItem(
      'finora-simulations',
      JSON.stringify(simulations),
    )

    navigate(`/resultado/${simulation.id}`)
  }

  function renderCurrentStep() {
    switch (currentStep) {
      case 1:
        return (
          <Input
            id="monthly-income"
            label="Renda mensal"
            type="text"
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={formData.monthlyIncome}
            onChange={(event) =>
              handleCurrencyChange('monthlyIncome', event.target.value)
            }
          />
        )

      case 2:
        return (
          <Input
            id="monthly-expenses"
            label="Gastos mensais"
            type="text"
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={formData.monthlyExpenses}
            onChange={(event) =>
              handleCurrencyChange('monthlyExpenses', event.target.value)
            }
          />
        )

      case 3:
        return (
          <Input
            id="current-savings"
            label="Quanto você possui guardado?"
            type="text"
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={formData.currentSavings}
            onChange={(event) =>
              handleCurrencyChange('currentSavings', event.target.value)
            }
          />
        )

      case 4:
        return (
          <Input
            id="financial-goal"
            label="Qual é o seu objetivo financeiro?"
            type="text"
            placeholder="Ex.: montar uma reserva de emergência"
            value={formData.financialGoal}
            onChange={(event) =>
              handleTextChange('financialGoal', event.target.value)
            }
          />
        )

      case 5:
        return (
          <Input
            id="goal-amount"
            label="Quanto você precisa para atingir esse objetivo?"
            type="text"
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={formData.goalAmount}
            onChange={(event) =>
              handleCurrencyChange('goalAmount', event.target.value)
            }
          />
        )

      default:
        return null
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
        Vamos planejar seu futuro
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Responda algumas questões para receber insights financeiros personalizados.
      </p>

      <div className="mt-8">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
        />
      </div>

      <div className="mt-8">
        <FormStep
          title={`Etapa ${currentStep}`}
          description="Preencha as informações desta etapa."
        >
          {renderCurrentStep()}

          <div className="mt-6 flex items-center justify-between">
            <Button
              type="button"
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
            >
              Voltar
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNextStep}
              >
                Continuar
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinish}
              >
                Finalizar simulação
              </Button>
            )}
          </div>
        </FormStep>
      </div>
    </main>
  )
}