import React from 'react'
import ReactDOM from 'react-dom/client'
// Fraunces carries the display voice: a variable soft-serif with a genuine
// wonk axis, so it has personality without being a novelty face.
import '@fontsource-variable/fraunces'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
