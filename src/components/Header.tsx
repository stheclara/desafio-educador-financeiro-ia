export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <div>
          <span className="text-xl font-bold text-primary">
            Finora
          </span>
        </div>

        <span className="text-sm text-muted-foreground">
          Educador Financeiro Inteligente
        </span>
      </div>
    </header>
  )
}