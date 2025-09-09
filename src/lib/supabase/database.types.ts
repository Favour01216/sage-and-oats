export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      hearts: {
        Row: {
          id: string;
          recipe_id: string;
          user_id: string | null;
          device_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          user_id?: string | null;
          device_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          user_id?: string | null;
          device_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          id: string;
          slug: string;
          title: string;
          hero_image_url: string | null;
          intro: string | null;
          yield: string | null;
          total_minutes: number | null;
          difficulty: string | null;
          tags: string[];
          cuisine: string | null;
          author_id: string | null;
          avg_rating: number | null;
          status: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          hero_image_url?: string | null;
          intro?: string | null;
          yield?: string | null;
          total_minutes?: number | null;
          difficulty?: string | null;
          tags?: string[];
          cuisine?: string | null;
          author_id?: string | null;
          avg_rating?: number | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          hero_image_url?: string | null;
          intro?: string | null;
          yield?: string | null;
          total_minutes?: number | null;
          difficulty?: string | null;
          tags?: string[];
          cuisine?: string | null;
          author_id?: string | null;
          avg_rating?: number | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      recipe_ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          group_label: string | null;
          line_text: string;
          quantity_num: number | null;
          unit: string | null;
          item: string | null;
          note: string | null;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          group_label?: string | null;
          line_text: string;
          quantity_num?: number | null;
          unit?: string | null;
          item?: string | null;
          note?: string | null;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          group_label?: string | null;
          line_text?: string;
          quantity_num?: number | null;
          unit?: string | null;
          item?: string | null;
          note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          }
        ];
      };
      recipe_steps: {
        Row: {
          id: string;
          recipe_id: string;
          step_number: number;
          text: string;
          timer_seconds: number | null;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          step_number: number;
          text: string;
          timer_seconds?: number | null;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          step_number?: number;
          text?: string;
          timer_seconds?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_steps_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          }
        ];
      };
      recipe_nutrition: {
        Row: {
          recipe_id: string;
          calories: number | null;
          protein_g: number | null;
          fat_g: number | null;
          carbs_g: number | null;
          fiber_g: number | null;
          sugar_g: number | null;
          sodium_mg: number | null;
          raw_edamam: Json | null;
        };
        Insert: {
          recipe_id: string;
          calories?: number | null;
          protein_g?: number | null;
          fat_g?: number | null;
          carbs_g?: number | null;
          fiber_g?: number | null;
          sugar_g?: number | null;
          sodium_mg?: number | null;
          raw_edamam?: Json | null;
        };
        Update: {
          recipe_id?: string;
          calories?: number | null;
          protein_g?: number | null;
          fat_g?: number | null;
          carbs_g?: number | null;
          fiber_g?: number | null;
          sugar_g?: number | null;
          sodium_mg?: number | null;
          raw_edamam?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_nutrition_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: true;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          }
        ];
      };
      ratings: {
        Row: {
          id: string;
          recipe_id: string;
          user_id: string;
          stars: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          user_id: string;
          stars: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          user_id?: string;
          stars?: number;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ratings_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          }
        ];
      };
      cached_recipes: {
        Row: {
          id: number;
          uri: string;
          recipe_data: Json;
          source: string;
          view_count: number;
          save_count: number;
          created_at: string;
          updated_at: string;
          expires_at: string;
        };
        Insert: {
          uri: string;
          recipe_data: Json;
          source?: string;
          view_count?: number;
          save_count?: number;
          expires_at?: string;
        };
        Update: {
          uri?: string;
          recipe_data?: Json;
          source?: string;
          view_count?: number;
          save_count?: number;
          expires_at?: string;
        };
        Relationships: [];
      };
      search_cache: {
        Row: {
          id: number;
          cache_key: string;
          query_params: Json;
          results: Json;
          hit_count: number;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          cache_key: string;
          query_params: Json;
          results: Json;
          hit_count?: number;
          expires_at?: string;
        };
        Update: {
          cache_key?: string;
          query_params?: Json;
          results?: Json;
          hit_count?: number;
          expires_at?: string;
        };
        Relationships: [];
      };
      user_collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      collection_recipes: {
        Row: {
          id: string;
          collection_id: string;
          recipe_uri: string;
          notes: string | null;
          added_at: string;
        };
        Insert: {
          id?: string;
          collection_id: string;
          recipe_uri: string;
          notes?: string | null;
          added_at?: string;
        };
        Update: {
          id?: string;
          collection_id?: string;
          recipe_uri?: string;
          notes?: string | null;
          added_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collection_recipes_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "user_collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_recipes_recipe_uri_fkey";
            columns: ["recipe_uri"];
            isOneToOne: false;
            referencedRelation: "cached_recipes";
            referencedColumns: ["recipe_uri"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_save_count: {
        Args: {
          recipe_uri: string;
        };
        Returns: undefined;
      };
      decrement_save_count: {
        Args: {
          recipe_uri: string;
        };
        Returns: undefined;
      };
      cleanup_expired_cache: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
