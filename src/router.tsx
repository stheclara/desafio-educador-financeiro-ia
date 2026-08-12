import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './layouts/RootLayout'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: (
          <h1 className="text-2xl font-bold">
            Formulário de Simulação
          </h1>
        ),
      },
      {
        path: '/resultado',
        element: (
          <h1 className="text-2xl font-bold">
            Resultado da Simulação
          </h1>
        ),
      },
    ],
  },
])