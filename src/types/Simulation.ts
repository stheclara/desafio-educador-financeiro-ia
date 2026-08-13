export interface SimulationData {
  monthlyIncome: string
  monthlyExpenses: string
  currentSavings: string
  financialGoal: string
  goalAmount: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface Simulation extends SimulationData {
  id: string
  createdAt: string
  analysis?: string
  chatHistory?: ChatMessage[]
}