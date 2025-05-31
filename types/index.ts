export type User = {
  id: string
  email: string
  name: string | null
  role: 'ADMIN' | 'CUSTOMER'
  phone?: string | null
  created_at?: string
  updated_at?: string
  is_active?: boolean
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url?: string | null
  category_id: string
  unit: string
  unit_quantity: number
  stock: number
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export type CartItem = {
  id: string
  name: string
  price: number
  unit: string
  unitQuantity: number
  image_url: string | null
  quantity: number
} 