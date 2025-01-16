import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import {AuthContextProvider} from './context/authContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContextProvider>
    <ShopContextProvider>
      <App/>
    </ShopContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
)
