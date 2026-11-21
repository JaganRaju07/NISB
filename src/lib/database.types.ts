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
      admins: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      societies: {
        Row: {
          id: string;
          slug: string;
          name: string;
          short_name: string | null;
          description: string | null;
          logo_url: string | null;
          established_year: string | null;
          website_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          short_name?: string | null;
          description?: string | null;
          logo_url?: string | null;
          established_year?: string | null;
          website_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          short_name?: string | null;
          description?: string | null;
          logo_url?: string | null;
          established_year?: string | null;
          website_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      members: {
        Row: {
          id: string;
          full_name: string;
          role: string | null;
          department: string | null;
          batch_year: string | null;
          photo_url: string | null;
          bio: string | null;
          interests: string[] | null;
          tenure_start: string | null;
          tenure_end: string | null;
          status: "draft" | "published" | "archived";
          verification_status: "pending" | "source_listed" | "confirmed";
          source_note: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          role?: string | null;
          department?: string | null;
          batch_year?: string | null;
          photo_url?: string | null;
          bio?: string | null;
          interests?: string[] | null;
          tenure_start?: string | null;
          tenure_end?: string | null;
          status?: "draft" | "published" | "archived";
          verification_status?: "pending" | "source_listed" | "confirmed";
          source_note?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: string | null;
          department?: string | null;
          batch_year?: string | null;
          photo_url?: string | null;
          bio?: string | null;
          interests?: string[] | null;
          tenure_start?: string | null;
          tenure_end?: string | null;
          status?: "draft" | "published" | "archived";
          verification_status?: "pending" | "source_listed" | "confirmed";
          source_note?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      member_roles: {
        Row: {
          id: string;
          member_id: string;
          society_id: string | null;
          role_title: string;
          tier: "branch" | "society";
          start_year: string | null;
          end_year: string | null;
          is_current: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          society_id?: string | null;
          role_title: string;
          tier?: "branch" | "society";
          start_year?: string | null;
          end_year?: string | null;
          is_current?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          society_id?: string | null;
          role_title?: string;
          tier?: "branch" | "society";
          start_year?: string | null;
          end_year?: string | null;
          is_current?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      milestones: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          date: string | null;
          milestone_year: number | null;
          category: string | null;
          society_id: string | null;
          image_url: string | null;
          status: "draft" | "published" | "archived";
          verification_status: "pending" | "source_listed" | "confirmed";
          source_note: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          date?: string | null;
          milestone_year?: number | null;
          category?: string | null;
          society_id?: string | null;
          image_url?: string | null;
          status?: "draft" | "published" | "archived";
          verification_status?: "pending" | "source_listed" | "confirmed";
          source_note?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          date?: string | null;
          milestone_year?: number | null;
          category?: string | null;
          society_id?: string | null;
          image_url?: string | null;
          status?: "draft" | "published" | "archived";
          verification_status?: "pending" | "source_listed" | "confirmed";
          source_note?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      milestone_members: {
        Row: {
          id: string;
          milestone_id: string;
          member_id: string;
          role_in_milestone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          milestone_id: string;
          member_id: string;
          role_in_milestone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          milestone_id?: string;
          member_id?: string;
          role_in_milestone?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      public_members: {
        Row: {
          id: string;
          full_name: string;
          role: string | null;
          department: string | null;
          batch_year: string | null;
          photo_url: string | null;
          bio: string | null;
          interests: string[] | null;
          tenure_start: string | null;
          tenure_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
      };
      public_milestones: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          date: string | null;
          milestone_year: number | null;
          category: string | null;
          society_id: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_superadmin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_member_published: {
        Args: {
          p_member_id: string;
        };
        Returns: boolean;
      };
      is_milestone_published: {
        Args: {
          p_milestone_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
};
