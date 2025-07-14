import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from '../src/hooks/store.js'; // RTK Query'nin entegre edildiği store

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
   </Provider>
)
