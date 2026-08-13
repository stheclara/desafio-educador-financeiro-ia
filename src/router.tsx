import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from './layouts/RootLayout'
import { SimulationFormPage } from './pages/SimulationFormPage'
import { SimulationHistoryDetailsPage } from './pages/SimulationHistoryDetailsPage'
import { SimulationHistoryPage } from './pages/SimulationHistoryPage'
import { SimulationResultPage } from './pages/SimulationResultPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <SimulationFormPage />,
      },
      {
        path: '/historico',
        element: <SimulationHistoryPage />,
      },
      {
        path: '/historico/:id',
        element: <SimulationHistoryDetailsPage />,
      },
      {
        path: '/resultado/:id',
        element: <SimulationResultPage />,
      },
    ],
  },
])