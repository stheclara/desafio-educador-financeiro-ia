import { Moon, Sun } from 'lucide-react'

import { useTheme } from '../hooks/useTheme'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <div>
          <span className="text-xl font-bold text-primary">
            Finora
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Educador Financeiro Inteligente
          </span>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted"
            aria-label={
              theme === 'light'
                ? 'Ativar tema escuro'
                : 'Ativar tema claro'
            }
            title={
              theme === 'light'
                ? 'Ativar tema escuro'
                : 'Ativar tema claro'
            }
          >
            {theme === 'light' ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}