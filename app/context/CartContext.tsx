"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface MedusaClient {
  store?: {
    cart?: {
      retrieve?: (id: string) => Promise<{ cart?: { items?: CartItem[], id?: string } }>
      create?: (data?: Record<string, unknown>) => Promise<{ cart?: { items?: CartItem[], id?: string } }>
      createLineItem?: (cartId: string, data: Record<string, unknown>) => Promise<{ cart?: { items?: CartItem[], id?: string } }>
      updateLineItem?: (cartId: string, lineId: string, data: Record<string, unknown>) => Promise<{ cart?: { items?: CartItem[], id?: string } }>
      deleteLineItem?: (cartId: string, lineId: string) => Promise<{ cart?: { items?: CartItem[], id?: string } }>
      lineItems?: {
        create?: (cartId: string, data: Record<string, unknown>) => Promise<{ cart?: { items?: CartItem[], id?: string } }>
        update?: (cartId: string, lineId: string, data: Record<string, unknown>) => Promise<{ cart?: { items?: CartItem[], id?: string } }>
        delete?: (cartId: string, lineId: string) => Promise<{ cart?: { items?: CartItem[], id?: string } }>
      }
    }
    region?: {
      list?: () => Promise<{ regions?: Array<{ id: string }> }>
    }
  }
}

interface CartItem {
  id: string
  variant_id?: string
  product_id?: string
  title: string
  description?: string
  thumbnail?: string
  variant?: {
    id: string
    title: string
    sku?: string
    options?: Record<string, string>
  }
  quantity: number
  unit_price: number
  total: number
}

interface CartContextType {
  items: CartItem[]
  cartId: string | null
  isLoading: boolean
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  total: number
  subtotal: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartId, setCartId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [medusa, setMedusa] = useState<MedusaClient | null>(null)

  // Set client flag after hydration and initialize medusa client
  useEffect(() => {
    setIsClient(true)
    // Dynamically import medusa client only on client side
    const initMedusa = async () => {
      try {
        const createMedusaClient = await import("@/src/lib/medusa")
        const client = await createMedusaClient.default()
        setMedusa(client as unknown as MedusaClient)
      } catch (error) {
        console.error("Failed to initialize Medusa client:", error)
      }
    }
    initMedusa()
  }, [])

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = async (id: string) => {
      try {
        setIsLoading(true)
        // Check if medusa client is available
        if (!medusa || !medusa.store || !medusa.store.cart || !medusa.store.cart.retrieve) {
          console.warn("Medusa client not properly initialized")
          return
        }
        const response = await medusa.store.cart.retrieve(id)
        if (response?.cart) {
          setItems((response.cart.items || []) as CartItem[])
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        if (typeof window !== 'undefined') {
          localStorage.removeItem("cart_id")
        }
        setCartId(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Only access localStorage on the client side and after medusa is loaded
    if (isClient && medusa && typeof window !== 'undefined') {
      const savedCartId = localStorage.getItem("cart_id")
      if (savedCartId) {
        setCartId(savedCartId)
        loadCart(savedCartId)
      }
    }
  }, [isClient, medusa])


  const createCart = async () => {
    try {
      if (!medusa || !medusa.store || !medusa.store.cart || !medusa.store.region) {
        console.warn("Medusa client not properly initialized")
        return null
      }
      
      // First get regions to use for cart creation
      const regionsResponse = await medusa.store.region.list?.()
      if (!regionsResponse?.regions?.length) {
        console.error("No regions available for cart creation")
        return null
      }
      
      // Use the first available region
      const region = regionsResponse.regions[0]
      const response = await medusa.store.cart.create?.({ region_id: region.id })
      if (response?.cart) {
        setCartId(response.cart.id)
        if (typeof window !== 'undefined') {
          localStorage.setItem("cart_id", response.cart.id)
        }
        setItems((response.cart.items || []) as CartItem[])
        return response.cart // Return the newly created cart
      }
    } catch (error) {
      console.error("Error creating cart:", error)
    }
    return null
  }

  const addItem = async (variantId: string, quantity: number = 1) => {
    if (!isClient) return
    
    try {
      setIsLoading(true)
      let currentCartId = cartId

      // Create cart if it doesn't exist
      if (!currentCartId) {
        const newCart = await createCart()
        if (newCart) {
          currentCartId = newCart.id
        }
      }

      if (!currentCartId) {
        throw new Error("Failed to create cart")
      }

      if (!medusa || !medusa.store || !medusa.store.cart) {
        throw new Error("Medusa client not properly initialized")
      }

      const response = await medusa.store.cart.createLineItem(currentCartId, {
        variant_id: variantId,
        quantity,
      })

      if (response.cart) {
        setItems((response.cart.items || []) as CartItem[])
      }
    } catch (error) {
      console.error("Error adding item to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateItem = async (itemId: string, quantity: number) => {
    if (!isClient || !cartId) return

    try {
      setIsLoading(true)
      if (!medusa || !medusa.store || !medusa.store.cart) {
        throw new Error("Medusa client not properly initialized")
      }
      const response = await medusa.store.cart.updateLineItem(cartId, itemId, {
        quantity,
      })

      if (response.cart) {
        setItems((response.cart.items || []) as CartItem[])
      }
    } catch (error) {
      console.error("Error updating cart item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (itemId: string) => {
    if (!isClient || !cartId) return

    try {
      setIsLoading(true)
      if (!medusa || !medusa.store || !medusa.store.cart) {
        throw new Error("Medusa client not properly initialized")
      }
      const response = await medusa.store.cart.deleteLineItem(cartId, itemId)

      if (response?.cart) {
        setItems((response.cart.items || []) as CartItem[])
      }
    } catch (error) {
      console.error("Error removing cart item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    if (!isClient || !cartId) return

    try {
      setIsLoading(true)
      if (!medusa || !medusa.store || !medusa.store.cart) {
        throw new Error("Medusa client not properly initialized")
      }
      // Remove all items individually
      for (const item of items) {
        await medusa.store.cart.deleteLineItem(cartId, item.id)
      }
      setItems([])
    } catch (error) {
      console.error("Error clearing cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate totals from items
  const subtotal = items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0)
  const total = subtotal // For now, just subtotal. In real app, this would include taxes, shipping, etc.
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider value={{ 
      items, 
      cartId, 
      isLoading, 
      addItem, 
      updateItem, 
      removeItem, 
      clearCart, 
      total, 
      subtotal,
      itemCount 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
