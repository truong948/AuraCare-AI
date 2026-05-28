export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      consultations: {
        Row: {
          id: string;
          user_id: string | null;
          skin_concern: string;
          description: string;
          ai_summary: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          skin_concern: string;
          description: string;
          ai_summary?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          skin_concern?: string;
          description?: string;
          ai_summary?: Json | null;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_slug: string;
          product_name: string;
          product_image: string | null;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_slug: string;
          product_name: string;
          product_image?: string | null;
          unit_price: number;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_slug?: string;
          product_name?: string;
          product_image?: string | null;
          unit_price?: number;
          quantity?: number;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          status: "pending" | "processing" | "completed" | "cancelled";
          payment_status: "mock_unpaid" | "paid" | "failed" | "refunded";
          subtotal: number;
          shipping_fee: number;
          total: number;
          shipping_name: string;
          shipping_email: string;
          shipping_phone: string;
          shipping_address: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          user_id: string;
          status?: "pending" | "processing" | "completed" | "cancelled";
          payment_status?: "mock_unpaid" | "paid" | "failed" | "refunded";
          subtotal?: number;
          shipping_fee?: number;
          shipping_name: string;
          shipping_email: string;
          shipping_phone: string;
          shipping_address: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string;
          status?: "pending" | "processing" | "completed" | "cancelled";
          payment_status?: "mock_unpaid" | "paid" | "failed" | "refunded";
          subtotal?: number;
          shipping_fee?: number;
          shipping_name?: string;
          shipping_email?: string;
          shipping_phone?: string;
          shipping_address?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          label: string;
          price: number;
          stock_quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          label: string;
          price: number;
          stock_quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string;
          label?: string;
          price?: number;
          stock_quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          brand: string;
          category: "supplement" | "skincare";
          short_description: string;
          long_description: string;
          price: number;
          compare_at_price: number;
          stock_status: "in_stock" | "low_stock" | "out_of_stock";
          package_size: string | null;
          ingredients_text: string | null;
          usage_instructions: string | null;
          warnings: string | null;
          concern_tags: string[];
          symptom_tags: string[];
          benefit_tags: string[];
          searchable_text: string;
          rating: number;
          review_count: number;
          origin_country: string;
          badge: string | null;
          image: string | null;
          embedding_vector: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          brand?: string;
          category: "supplement" | "skincare";
          short_description: string;
          long_description: string;
          price: number;
          compare_at_price?: number;
          stock_status?: "in_stock" | "low_stock" | "out_of_stock";
          package_size?: string | null;
          ingredients_text?: string | null;
          usage_instructions?: string | null;
          warnings?: string | null;
          concern_tags?: string[];
          symptom_tags?: string[];
          benefit_tags?: string[];
          searchable_text?: string;
          rating?: number;
          review_count?: number;
          origin_country?: string;
          badge?: string | null;
          image?: string | null;
          embedding_vector?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          brand?: string;
          category?: "supplement" | "skincare";
          short_description?: string;
          long_description?: string;
          price?: number;
          compare_at_price?: number;
          stock_status?: "in_stock" | "low_stock" | "out_of_stock";
          package_size?: string | null;
          ingredients_text?: string | null;
          usage_instructions?: string | null;
          warnings?: string | null;
          concern_tags?: string[];
          symptom_tags?: string[];
          benefit_tags?: string[];
          searchable_text?: string;
          rating?: number;
          review_count?: number;
          origin_country?: string;
          badge?: string | null;
          image?: string | null;
          embedding_vector?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          status: "active" | "suspended";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          status?: "active" | "suspended";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          status?: "active" | "suspended";
          created_at?: string;
          updated_at?: string;
        };
      };
      skin_diaries: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          notes: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      skin_profiles: {
        Row: {
          user_id: string;
          skin_type: string;
          concerns: string[];
          allergies: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          skin_type: string;
          concerns?: string[];
          allergies?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          skin_type?: string;
          concerns?: string[];
          allergies?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      match_products_by_embedding: {
        Args: {
          query_embedding: number[] | string;
          match_limit?: number;
          match_category?: string | null;
        };
        Returns: {
          slug: string;
          similarity: number;
          reason: string;
        }[];
      };
      match_products_by_symptoms: {
        Args: {
          symptom_keywords: string;
          match_limit?: number;
        };
        Returns: {
          id: string;
          slug: string;
          name: string;
          short_description: string;
          price: number;
          score: number;
        }[];
      };
    };
    Enums: {
      app_role: "user" | "admin";
    };
  };
}
