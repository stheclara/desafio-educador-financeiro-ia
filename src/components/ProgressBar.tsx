interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Etapa {currentStep} de {totalSteps}
        </span>

        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}