import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}