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
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'pro' | 'enterprise'
          subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
          trial_ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          subscription_status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          subscription_status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: number
          user_id: string
          name: string
          sku: string
          category: string
          keywords: string[] | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          name: string
          sku: string
          category: string
          keywords?: string[] | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          name?: string
          sku?: string
          category?: string
          keywords?: string[] | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      suppliers: {
        Row: {
          id: number
          user_id: string
          name: string
          url: string
          status: 'active' | 'pending' | 'inactive' | 'error'
          api_key: string | null
          search_patterns: string[] | null
          last_scraped_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          name: string
          url: string
          status?: 'active' | 'pending' | 'inactive' | 'error'
          api_key?: string | null
          search_patterns?: string[] | null
          last_scraped_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          name?: string
          url?: string
          status?: 'active' | 'pending' | 'inactive' | 'error'
          api_key?: string | null
          search_patterns?: string[] | null
          last_scraped_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      price_entries: {
        Row: {
          id: string
          user_id: string
          product_id: number
          supplier_id: number
          price: number | null
          currency: string
          availability: 'in_stock' | 'out_of_stock' | 'limited' | 'unknown'
          confidence: number
          url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: number
          supplier_id: number
          price?: number | null
          currency?: string
          availability?: 'in_stock' | 'out_of_stock' | 'limited' | 'unknown'
          confidence?: number
          url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: number
          supplier_id?: number
          price?: number | null
          currency?: string
          availability?: 'in_stock' | 'out_of_stock' | 'limited' | 'unknown'
          confidence?: number
          url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_tier: 'free' | 'pro' | 'enterprise'
      subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
      supplier_status: 'active' | 'pending' | 'inactive' | 'error'
      availability_status: 'in_stock' | 'out_of_stock' | 'limited' | 'unknown'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}