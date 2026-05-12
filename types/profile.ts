export interface SkinProfile {
  user_id: string;
  skin_type: "oily" | "dry" | "combination" | "sensitive" | "normal";
  concerns: string[];
  allergies: string[];
  created_at: string;
  updated_at: string;
}
