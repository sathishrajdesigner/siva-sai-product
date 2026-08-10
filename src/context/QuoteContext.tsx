'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type QuoteItem = {
  id: string | number
  name: string
  qty: number
}

type QuoteContextType = {
  items: QuoteItem[]
  addItem: (product: { id: string | number; name: string }) => void
  removeItem: (id: string | number) => void
  updateQty: (id: string | number, qty: number) => void
  clearCart: () => void
  isInCart: (id: string | number) => boolean
  totalItems: number
}

const QuoteContext = createContext<QuoteContextType | null>(null)

const STORAGE_KEY = 'ssp_quote_cart'

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = useCallback((product: { id: string | number; name: string }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { id: product.id, name: product.name, qty: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: string | number) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQty = useCallback((id: string | number, qty: number) => {
    if (qty < 1) return
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const isInCart = useCallback((id: string | number) => items.some((i) => i.id === id), [items])

  const totalItems = items.length

  return (
    <QuoteContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, isInCart, totalItems }}>
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error('useQuote must be used inside QuoteProvider')
  return ctx
}
