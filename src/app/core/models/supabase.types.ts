import { LeadReason, LeadStatus } from './lead.models';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: 'admin' | 'editor';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: 'admin' | 'editor';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          role?: 'admin' | 'editor';
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          parent_name: string;
          phone: string;
          child_name: string | null;
          child_age: number | null;
          selected_track: string | null;
          reason: LeadReason;
          message: string | null;
          source_page: string | null;
          source_section: string | null;
          status: LeadStatus;
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_name: string;
          phone: string;
          child_name?: string | null;
          child_age?: number | null;
          selected_track?: string | null;
          reason: LeadReason;
          message?: string | null;
          source_page?: string | null;
          source_section?: string | null;
          status?: LeadStatus;
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          parent_name?: string;
          phone?: string;
          child_name?: string | null;
          child_age?: number | null;
          selected_track?: string | null;
          reason?: LeadReason;
          message?: string | null;
          source_page?: string | null;
          source_section?: string | null;
          status?: LeadStatus;
          internal_notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      lead_notes: {
        Row: {
          id: string;
          lead_id: string;
          admin_id: string | null;
          note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          admin_id?: string | null;
          note: string;
          created_at?: string;
        };
        Update: {
          note?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: { key: string; value: string; updated_at: string };
        Insert: { key: string; value: string; updated_at?: string };
        Update: { value?: string; updated_at?: string };
        Relationships: [];
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          title: string;
          body: string;
          is_enabled: boolean;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          title: string;
          body: string;
          is_enabled?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['homepage_sections']['Insert']>;
        Relationships: [];
      };
      tracks: {
        Row: {
          id: string;
          slug: string;
          title: string;
          age: string;
          focus: string;
          tools: string[];
          outcome: string;
          description: string;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['tracks']['Row']> & {
          slug: string;
          title: string;
          age: string;
          focus: string;
          outcome: string;
          description: string;
        };
        Update: Partial<Database['public']['Tables']['tracks']['Insert']>;
        Relationships: [];
      };
      stars_board: {
        Row: {
          id: string;
          student_name: string;
          avatar_url: string | null;
          track: string;
          badge: string;
          xp: number;
          project: string;
          quote: string;
          highlight_reason: string;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['stars_board']['Row']> & {
          student_name: string;
          track: string;
          badge: string;
          project: string;
          quote: string;
          highlight_reason: string;
        };
        Update: Partial<Database['public']['Tables']['stars_board']['Insert']>;
        Relationships: [];
      };
      content_items: {
        Row: {
          id: string;
          title: string;
          category: string;
          thumbnail_url: string | null;
          platform: 'instagram' | 'tiktok' | 'youtube' | 'blog';
          external_link: string;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['content_items']['Row']> & {
          title: string;
          category: string;
          platform: 'instagram' | 'tiktok' | 'youtube' | 'blog';
          external_link: string;
        };
        Update: Partial<Database['public']['Tables']['content_items']['Insert']>;
        Relationships: [];
      };
      gallery_items: {
        Row: {
          id: string;
          title: string;
          image_url: string;
          alt_text: string;
          item_type: 'photo' | 'project' | 'certificate';
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['gallery_items']['Row']> & {
          title: string;
          image_url: string;
          alt_text: string;
        };
        Update: Partial<Database['public']['Tables']['gallery_items']['Insert']>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          role: string;
          quote: string;
          image_url: string | null;
          rating: number;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['testimonials']['Row']> & {
          author_name: string;
          role: string;
          quote: string;
        };
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
        Relationships: [];
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['faqs']['Row']> & {
          question: string;
          answer: string;
        };
        Update: Partial<Database['public']['Tables']['faqs']['Insert']>;
        Relationships: [];
      };
      media_library: {
        Row: {
          id: string;
          file_name: string;
          public_url: string;
          bucket: string;
          path: string;
          mime_type: string | null;
          size_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          public_url: string;
          bucket: string;
          path: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['media_library']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
