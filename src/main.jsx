import React from 'react'
import ReactDOM from 'react-dom/client'
// Instrument Serif carries the display voice: high-contrast, tightly fitted,
// one weight only — editorial rather than decorative, which is what lets the
// monochrome palette stay quiet without going bland.
import '@fontsource/instrument-serif'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
