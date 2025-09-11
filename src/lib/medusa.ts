// Dynamic import to avoid ESM issues
export type MedusaClient = {
  store: {
    product: {
      list: (params?: Record<string, unknown>) => Promise<{ products: unknown[] }>
      retrieve: (id: string) => Promise<Product | null>
    }
    collection: {
      list: (params?: Record<string, unknown>) => Promise<{ collections: unknown[] }>
      retrieve: (id: string) => Promise<unknown>
    }
    cart: {
      create: (params?: Record<string, unknown>) => Promise<{ cart: Cart | null }>
      retrieve: (id: string) => Promise<Cart | null>
      addLineItem: (id: string, params: Record<string, unknown>) => Promise<unknown>
      updateLineItem: (id: string, lineId: string, params: Record<string, unknown>) => Promise<unknown>
      deleteLineItem: (id: string, lineId: string) => Promise<unknown>
    }
    region: {
      list: () => Promise<{ regions: Region[] }>
    }
  }
}

let medusaClient: MedusaClient | null = null

export type Product = {
  id: string;
  title: string;
  description: string | null;
  handle: string;
  status: string;
  images: Array<{ url: string; alt?: string }> | null;
  options?: Array<{
    id: string;
    title: string;
    values: Array<{ id: string; value: string }>;
  }> | null;
  variants?: Array<{
    id: string;
    title: string;
    sku?: string;
    inventory_quantity?: number;
    prices?: Array<{
      id: string;
      amount: number;
      currency_code: string;
    }>;
    options?: Record<string, ProductOptionValue>;
  }> | null;
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  created_at: string;
  updated_at: string;
}

export type ProductOptionValue = {
  id: string;
  value: string;
  metadata: Record<string, unknown> | null;
  option_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

// Commented out unused interfaces - keep for future use
// interface QueryParams {
//   handle?: string
//   limit?: number
//   category_id?: string
//   q?: string
// }

// interface CartItem {
//   variant_id: string
//   quantity: number
// }

// interface UpdateItem {
//   quantity: number
// }

// Create a factory function to initialize the client
const createMedusaClient = async (): Promise<MedusaClient> => {
  if (medusaClient) return medusaClient
  
  try {
    // Try dynamic import  
    let Medusa
    try {
      const sdkModule = await import('@medusajs/js-sdk')
      // Use the default export which should be the Medusa class
      Medusa = sdkModule.default
    } catch {
      throw new Error('Unable to import Medusa SDK')
    }
    
    if (Medusa) {
      medusaClient = new Medusa({
        baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9004",
        debug: process.env.NODE_ENV === "development",
        publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      })
      return medusaClient
    } else {
      throw new Error('Medusa SDK not available')
    }
  } catch (error) {
    console.error('Failed to initialize Medusa client:', error)
    console.log('Falling back to mock client - products will not load from backend')
    // Return a mock client that handles basic operations
    return {
      store: {
        product: {
          list: async () => {
            console.log('Mock client: returning empty product list')
            return { products: [] }
          },
          retrieve: async () => null
        },
        collection: {
          list: async () => {
            console.log('Mock client: returning empty collection list')
            return { collections: [] }
          },
          retrieve: async () => null
        },
        cart: {
          create: async () => ({ cart: null }),
          retrieve: async () => null,
          addLineItem: async () => null,
          updateLineItem: async () => null,
          deleteLineItem: async () => null
        },
        region: {
          list: async () => ({ regions: [] })
        }
      }
    }
  }
}

export default createMedusaClient

export type Cart = {
  id: string;
  email?: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    variant: {
      id: string;
      title: string;
      prices: Array<{
        amount: number;
        currency_code: string;
      }>;
    };
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  region: {
    id: string;
    name: string;
    currency_code: string;
  };
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  created_at: string;
  updated_at: string;
}

export type Region = {
  id: string;
  name: string;
  currency_code: string;
  countries: Array<{
    id: string;
    iso_2: string;
    iso_3: string;
    num_code: string;
    name: string;
    display_name: string;
  }>;
}

export type Customer = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  billing_address?: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    country_code: string;
    province?: string;
    postal_code: string;
    phone?: string;
  };
  shipping_addresses: Array<{
    id: string;
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    country_code: string;
    province?: string;
    postal_code: string;
    phone?: string;
  }>;
  created_at: string;
  updated_at: string;
}

export type Order = {
  id: string;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  display_id: number;
  cart_id: string;
  customer: Customer;
  email: string;
  billing_address: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    country_code: string;
    province?: string;
    postal_code: string;
    phone?: string;
  };
  shipping_address: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    country_code: string;
    province?: string;
    postal_code: string;
    phone?: string;
  };
  items: Array<{
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    variant: {
      id: string;
      title: string;
    };
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  region: Region;
  currency_code: string;
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  created_at: string;
  updated_at: string;
}