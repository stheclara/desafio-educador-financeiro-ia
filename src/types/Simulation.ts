export interface SimulationData {
  monthlyIncome: string
  monthlyExpenses: string
  currentSavings: string
  financialGoal: string
  goalAmount: string
}

export interface Simulation extends SimulationData {
  id: string
  createdAt: string
}