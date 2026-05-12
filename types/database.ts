export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      consultations: {
        Row: {
          id: string;
          user_id: string;
          skin_concern: string;
          description: string;
          created_at: string;
        };
        Insert: {
          user_id?: string;
          skin_concern: string;
          description: string;
        };
        Update: {
          skin_concern?: string;
          description?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          created_at?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number | null;
          embedding: number[];
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price?: number | null;
          embedding: number[];
          created_at?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          price?: number | null;
          embedding?: number[];
          created_at?: string | null;
        };
      };
      skin_diaries: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          notes: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          image_url: string;
          notes: string;
        };
        Update: {
          image_url?: string;
          notes?: string;
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
          concerns: string[];
          allergies?: string[];
        };
        Update: {
          skin_type?: string;
          concerns?: string[];
          allergies?: string[];
        };
      };
    };
    Views: {};
    Functions: {
      match_products_by_symptoms: {
        Args: {
          symptom_keywords: string;
          match_limit?: number;
        };
        Returns: {
          id: string;
          name: string;
          description: string | null;
          price: number | null;
          score: number;
        }[];
      };
    };
    Enums: {};
  };
}
