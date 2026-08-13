import React from 'react'
import ReactDOM from 'react-dom/client'
/* Cinzel stands in for Trajan Pro, the board's primary. Only the weights the
   display voice actually uses — 400 for headings, 600 for the wordmark lockup
   — because a face used exclusively at large sizes does not need five. */
import '@fontsource/cinzel/400.css'
import '@fontsource/cinzel/600.css'
/* Montserrat is the board's own secondary, variable, doing every job below
   display size. */
import '@fontsource-variable/montserrat'

/* ── The three service identities ──────────────────────────────────────
   Cinzel and Montserrat are the group's voice and hold the home page, the
   navigation and every service bar. Below that bar each service speaks in its
   own: a transit grotesque for Transport, a warm optical serif for Workforce,
   a drafting face for Renovation.

   Latin subsets and single axes only — these are three pairings on top of the
   group's two, and shipping every weight of every one of them would cost more
   than the whole rest of the page. */

/* Transport — timetable and instrument panel. */
import '@fontsource/barlow-condensed/latin-500.css'
import '@fontsource/barlow-condensed/latin-600.css'
import '@fontsource/barlow/latin-400.css'
import '@fontsource/barlow/latin-500.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-600.css'

/* Workforce — editorial and warm. Fraunces carries an optical-size axis, which
   is the entire reason to choose it: it can be soft at reading size and sharp
   at display size from one file. */
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/work-sans/wght.css'

/* Renovation — drafting table. */
import '@fontsource-variable/space-grotesk/wght.css'
import '@fontsource/space-mono/latin-400.css'
import '@fontsource/space-mono/latin-700.css'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
