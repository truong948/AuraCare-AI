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
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
