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
import { boot } from './i18n/boot'
import { setLanguage, DEFAULT_LANG } from './i18n/core'

/* The language first, then the app. Every content module reads the language
   as it is evaluated, so App, and everything it imports, is loaded only once
   the chosen language's text is in place. */
/* If choosing the language fails for any reason, the site still renders, in
   English: a page in the wrong language beats no page. */
boot()
  .catch(() => setLanguage(DEFAULT_LANG, null))
  .then(() => import('./App.jsx'))
  .then(({ default: App }) => {
    ReactDOM.createRoot(document.getElementById('root')).render(<App />)
  })
