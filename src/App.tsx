import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import GeneralError from './pages/errors/GeneralError'
import NotFound from './pages/errors/NotFound'
import Home from './pages/Home'

import { Amplify } from 'aws-amplify'
import awsConfig from './aws-exports'

Amplify.configure(awsConfig)

function App() {

  const sharedRoutingBehavior: RouteObject = {
    errorElement: <GeneralError />,
  }

  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]

  const router = createBrowserRouter(routes.map(route => ({ ...sharedRoutingBehavior, ...route } as RouteObject)))

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
