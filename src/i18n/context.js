import { createContext } from 'react'

/* The language switcher's action, provided by App so it can carry the open
   service page across the load. A switcher outside the provider still works:
   it simply has nothing to carry. */
export const LangContext = createContext(null)
