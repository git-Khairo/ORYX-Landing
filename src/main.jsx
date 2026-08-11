import React from 'react'
import ReactDOM from 'react-dom/client'
/* `opsz.css`, not the default entry — it carries Inter's optical-size axis
   alongside weight, which is the entire reason to pick Inter here. */
/* Cormorant Garamond is the logo's own face — high contrast, fine bracketed
   serifs. It carries the display voice so the page and the mark agree.
   Inter reads at length underneath it. */
import '@fontsource-variable/cormorant-garamond'
import '@fontsource-variable/inter/opsz.css'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
