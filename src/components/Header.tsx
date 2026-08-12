import { Link } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'

import { useTheme } from '../hooks/useTheme'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold text-primary"
        >
          Finora
        </Link>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-5">
            <Link
              to="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Nova simulação
            </Link>

            <Link
              to="/historico"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Histórico
            </Link>
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-card"
            aria-label={
              theme === 'light'
                ? 'Ativar tema escuro'
                : 'Ativar tema claro'
            }
          >
            {theme === 'light' ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}