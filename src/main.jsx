import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';

// Uygulama Redux Provider ile sarılır, tüm alt bileşenler store'a erişebilir.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>   // Store'u burada doğru şekilde sağlıyoruz
      <App />
    </Provider>
  </StrictMode>
);
