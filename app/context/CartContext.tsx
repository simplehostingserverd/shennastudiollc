"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import medusa from "@/src/lib/medusa"

interface CartItem {
  id: string
  variant_id: string
  product_id: string
  title: string
  description?: string
  thumbnail: string
  variant: {
    id: string
    title: string
    sku?: string
    options: Record<string, string>
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

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = async (id: string) => {
      try {
        setIsLoading(true)
        const response = await medusa.store.carts.retrieve(id)
        if (response.cart) {
          setItems(response.cart.items || [])
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        localStorage.removeItem("cart_id")
        setCartId(null)
      } finally {
        setIsLoading(false)
      }
    }

    const savedCartId = localStorage.getItem("cart_id")
    if (savedCartId) {
      setCartId(savedCartId)
      loadCart(savedCartId)
    }
  }, [])


  const createCart = async () => {
    try {
      const response = await medusa.store.carts.create({})
      if (response.cart) {
        setCartId(response.cart.id)
        localStorage.setItem("cart_id", response.cart.id)
        setItems(response.cart.items || [])
      }
    } catch (error) {
      console.error("Error creating cart:", error)
    }
  }

  const addItem = async (variantId: string, quantity: number = 1) => {
    try {
      setIsLoading(true)
      let currentCartId = cartId

      // Create cart if it doesn't exist
      if (!currentCartId) {
        await createCart()
        currentCartId = cartId
      }

      if (!currentCartId) {
        throw new Error("Failed to create cart")
      }

      const response = await medusa.store.carts.lineItems.create(currentCartId, {
        variant_id: variantId,
        quantity,
      })

      if (response.cart) {
        setItems(response.cart.items || [])
      }
    } catch (error) {
      console.error("Error adding item to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateItem = async (itemId: string, quantity: number) => {
    if (!cartId) return

    try {
      setIsLoading(true)
      const response = await medusa.store.carts.lineItems.update(cartId, itemId, {
        quantity,
      })

      if (response.cart) {
        setItems(response.cart.items || [])
      }
    } catch (error) {
      console.error("Error updating cart item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (itemId: string) => {
    if (!cartId) return

    try {
      setIsLoading(true)
      const response = await medusa.store.carts.lineItems.delete(cartId, itemId)

      if (response.cart) {
        setItems(response.cart.items || [])
      }
    } catch (error) {
      console.error("Error removing cart item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    if (!cartId) return

    try {
      setIsLoading(true)
      // Remove all items individually
      for (const item of items) {
        await medusa.store.carts.lineItems.delete(cartId, item.id)
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
