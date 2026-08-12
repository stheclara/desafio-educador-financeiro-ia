import type { ReactNode } from 'react'

interface QuestionCardProps {
  title: string
  description?: string
  children: ReactNode
}

export function QuestionCard({
  title,
  description,
  children,
}: QuestionCardProps) {
  return (
    <section className="rounded-xl border border-border bg-background p-6">
      <h2 className="text-lg font-semibold text-foreground">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      )}

      <div className="mt-5">
        {children}
      </div>
    </section>
  )
}