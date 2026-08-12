import type { ReactNode } from 'react'

interface FormStepProps {
  title: string
  description?: string
  children: ReactNode
}

export function FormStep({
  title,
  description,
  children,
}: FormStepProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  )
}