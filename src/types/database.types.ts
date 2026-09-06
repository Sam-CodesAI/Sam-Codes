export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          country: string | null
          created_at: string
          device_type: string | null
          event_name: string
          id: string
          metadata: Json
          path: string
          referrer: string | null
          section: string | null
          session_id: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_name: string
          id?: string
          metadata?: Json
          path?: string
          referrer?: string | null
          section?: string | null
          session_id: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_name?: string
          id?: string
          metadata?: Json
          path?: string
          referrer?: string | null
          section?: string | null
          session_id?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      assistant_knowledge: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          keywords: Json
          order_index: number
          question: string
          status: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          id?: string
          keywords?: Json
          order_index?: number
          question: string
          status?: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          keywords?: Json
          order_index?: number
          question?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string
          created_at: string
          details: Json
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_email: string
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_email?: string
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      capabilities: {
        Row: {
          category: string
          created_at: string
          description: string
          highlights: Json
          icon: string
          id: string
          order_index: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          highlights?: Json
          icon?: string
          id?: string
          order_index?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          highlights?: Json
          icon?: string
          id?: string
          order_index?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      experiments: {
        Row: {
          category: string
          created_at: string
          current_stage: string | null
          description: string
          id: string
          notes: string | null
          objective: string | null
          state: string
          status: string
          tech_stack: Json
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          current_stage?: string | null
          description: string
          id?: string
          notes?: string | null
          objective?: string | null
          state: string
          status?: string
          tech_stack?: Json
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          current_stage?: string | null
          description?: string
          id?: string
          notes?: string | null
          objective?: string | null
          state?: string
          status?: string
          tech_stack?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      exploring_topics: {
        Row: {
          category: string
          focus: string
          id: string
          is_visible: boolean
          name: string
          order_index: number
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          focus: string
          id?: string
          is_visible?: boolean
          name: string
          order_index?: number
          status: string
          updated_at?: string
        }
        Update: {
          category?: string
          focus?: string
          id?: string
          is_visible?: boolean
          name?: string
          order_index?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          contact_method: string
          created_at: string
          email: string | null
          id: string
          ip_hash: string | null
          is_important: boolean
          message: string
          name: string
          private_notes: string | null
          service_requested: string
          status: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          contact_method: string
          created_at?: string
          email?: string | null
          id?: string
          ip_hash?: string | null
          is_important?: boolean
          message: string
          name: string
          private_notes?: string | null
          service_requested: string
          status?: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          contact_method?: string
          created_at?: string
          email?: string | null
          id?: string
          ip_hash?: string | null
          is_important?: boolean
          message?: string
          name?: string
          private_notes?: string | null
          service_requested?: string
          status?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      milestones: {
        Row: {
          category: string
          created_at: string
          date_label: string
          description: string
          id: string
          is_visible: boolean
          organization_or_event: string
          status: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          date_label: string
          description: string
          id?: string
          is_visible?: boolean
          organization_or_event: string
          status?: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          date_label?: string
          description?: string
          id?: string
          is_visible?: boolean
          organization_or_event?: string
          status?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number
          bio: string
          full_name: string
          hero_description: string
          hero_title: string
          id: string
          identity_headline: string
          location: string
          philosophy_statement: string
          preferred_name: string
          status: string
          updated_at: string
          values: Json
        }
        Insert: {
          age?: number
          bio: string
          full_name?: string
          hero_description: string
          hero_title: string
          id?: string
          identity_headline?: string
          location?: string
          philosophy_statement: string
          preferred_name?: string
          status?: string
          updated_at?: string
          values?: Json
        }
        Update: {
          age?: number
          bio?: string
          full_name?: string
          hero_description?: string
          hero_title?: string
          id?: string
          identity_headline?: string
          location?: string
          philosophy_statement?: string
          preferred_name?: string
          status?: string
          updated_at?: string
          values?: Json
        }
        Relationships: []
      }
      projects: {
        Row: {
          approach: string
          architecture: Json
          category: string
          created_at: string
          documentation_url: string | null
          featured: boolean
          full_description: string
          gallery: Json
          github_url: string | null
          hero_image: string | null
          id: string
          lessons: string
          live_url: string | null
          metrics: Json
          problem_statement: string
          publication_date: string | null
          published_at: string | null
          results: string
          short_description: string
          slug: string
          status: string
          tech_stack: Json
          title: string
          tools: Json
          updated_at: string
        }
        Insert: {
          approach: string
          architecture?: Json
          category: string
          created_at?: string
          documentation_url?: string | null
          featured?: boolean
          full_description: string
          gallery?: Json
          github_url?: string | null
          hero_image?: string | null
          id?: string
          lessons: string
          live_url?: string | null
          metrics?: Json
          problem_statement: string
          publication_date?: string | null
          published_at?: string | null
          results: string
          short_description: string
          slug: string
          status?: string
          tech_stack?: Json
          title: string
          tools?: Json
          updated_at?: string
        }
        Update: {
          approach?: string
          architecture?: Json
          category?: string
          created_at?: string
          documentation_url?: string | null
          featured?: boolean
          full_description?: string
          gallery?: Json
          github_url?: string | null
          hero_image?: string | null
          id?: string
          lessons?: string
          live_url?: string | null
          metrics?: Json
          problem_statement?: string
          publication_date?: string | null
          published_at?: string | null
          results?: string
          short_description?: string
          slug?: string
          status?: string
          tech_stack?: Json
          title?: string
          tools?: Json
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          cta_label: string
          cta_link: string
          deliverables: Json
          full_description: string
          id: string
          is_available: boolean
          order_index: number
          short_description: string
          status: string
          title: string
          typical_delivery: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label?: string
          cta_link?: string
          deliverables?: Json
          full_description: string
          id?: string
          is_available?: boolean
          order_index?: number
          short_description: string
          status?: string
          title: string
          typical_delivery?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string
          cta_link?: string
          deliverables?: Json
          full_description?: string
          id?: string
          is_available?: boolean
          order_index?: number
          short_description?: string
          status?: string
          title?: string
          typical_delivery?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      social_links: {
        Row: {
          description: string
          display_name: string
          id: string
          is_visible: boolean
          platform: string
          priority: number
          updated_at: string
          url: string
          username: string
        }
        Insert: {
          description: string
          display_name: string
          id: string
          is_visible?: boolean
          platform: string
          priority?: number
          updated_at?: string
          url: string
          username: string
        }
        Update: {
          description?: string
          display_name?: string
          id?: string
          is_visible?: boolean
          platform?: string
          priority?: number
          updated_at?: string
          url?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
