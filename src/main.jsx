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

/* Workforce — site work, not editorial. Archivo is a wide, sturdy grotesque
   run heavy for display and regular for text: workwear and signage rather
   than a magazine. Its silhouette is the opposite of Transport's condensed
   Barlow, which is what keeps the two pages apart at a glance.

   It replaces Fraunces and Work Sans. Fraunces was also being asked for a
   `SOFT` axis that the `opsz` subset never carried, so those declarations
   were silently doing nothing. */
import '@fontsource-variable/archivo/standard.css'

/* Renovation — drafting table. */
import '@fontsource-variable/space-grotesk/wght.css'
import '@fontsource/space-mono/latin-400.css'
import '@fontsource/space-mono/latin-700.css'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
