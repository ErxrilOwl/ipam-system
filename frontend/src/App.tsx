import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';

import './css/globals.css';
import { router } from './routes/Router';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
