import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    children: [
      {
        path: '/',
        element: <h1>Formulário de Simulação</h1>,
      },
      {
        path: '/resultado',
        element: <h1>Resultado da Simulação</h1>,
      },
    ],
  },
])