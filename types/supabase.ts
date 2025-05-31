export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          price: number
          stock: number
          image_url: string | null
          category_id: string
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          price: number
          stock: number
          image_url?: string | null
          category_id: string
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          price?: number
          stock?: number
          image_url?: string | null
          category_id?: string
          is_active?: boolean
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          image_url: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          total: number
          status: Database['public']['Enums']['order_status']
          shipping_address_id: string | null
          tracking_number: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          total: number
          status?: Database['public']['Enums']['order_status']
          shipping_address_id?: string | null
          tracking_number?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          total?: number
          status?: Database['public']['Enums']['order_status']
          shipping_address_id?: string | null
          tracking_number?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          created_at: string
          order_id: string
          product_id: string
          quantity: number
          price: number
        }
        Insert: {
          id?: string
          created_at?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
        }
        Update: {
          id?: string
          created_at?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
        }
      }
      addresses: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          street: string
          city: string
          state: string
          postal_code: string
          country: string
          is_default: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          street: string
          city: string
          state: string
          postal_code: string
          country: string
          is_default?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          street?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          is_default?: boolean
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string | null
          phone: string | null
          role: Database['public']['Enums']['user_role']
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          name?: string | null
          phone?: string | null
          role?: Database['public']['Enums']['user_role']
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string | null
          phone?: string | null
          role?: Database['public']['Enums']['user_role']
          is_active?: boolean
        }
      }
    }
    Enums: {
      order_status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
      user_role: 'ADMIN' | 'CUSTOMER'
    }
  }
} 