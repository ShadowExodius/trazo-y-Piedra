import { useContext } from 'react'
import { BolsaContext } from './bolsaContext.js'

export function useBolsa() {
  const ctx = useContext(BolsaContext)
  if (!ctx) throw new Error('useBolsa debe usarse dentro de <BolsaProvider>')
  return ctx
}
