import React from 'react'
import ReactDOM from 'react-dom/client'
/* Cinzel stands in for Trajan Pro, the board's primary. Only the weights the
   display voice actually uses — 400 for headings, 600 for the wordmark lockup
   and the heavier headings on Transport and Workforce — because a face used
   exclusively at large sizes does not need five. */
import '@fontsource/cinzel/400.css'
import '@fontsource/cinzel/600.css'
/* Montserrat is the board's own secondary, variable, doing every job below
   display size. These two are the only faces on the site, the service pages
   included: they used to set their own, and the board allows only these. */
import '@fontsource-variable/montserrat'

import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
