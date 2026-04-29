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
      murid: {
        Row: {
          created_at: string
          id: string
          jadwal: string
          level: Database["public"]["Enums"]["murid_level"]
          mulai_belajar: string
          nama: string
          panggilan: string
          pengajar: string
          slug: string
          target_saat_ini: string
          total_pertemuan: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          jadwal?: string
          level?: Database["public"]["Enums"]["murid_level"]
          mulai_belajar?: string
          nama: string
          panggilan: string
          pengajar?: string
          slug: string
          target_saat_ini?: string
          total_pertemuan?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          jadwal?: string
          level?: Database["public"]["Enums"]["murid_level"]
          mulai_belajar?: string
          nama?: string
          panggilan?: string
          pengajar?: string
          slug?: string
          target_saat_ini?: string
          total_pertemuan?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      progres_pekanan: {
        Row: {
          created_at: string
          id: string
          kelancaran: number
          murid_id: string
          pekan: string
          pengucapan: number
          tajwid: number
          tartil: number
          urutan: number
        }
        Insert: {
          created_at?: string
          id?: string
          kelancaran?: number
          murid_id: string
          pekan: string
          pengucapan?: number
          tajwid?: number
          tartil?: number
          urutan?: number
        }
        Update: {
          created_at?: string
          id?: string
          kelancaran?: number
          murid_id?: string
          pekan?: string
          pengucapan?: number
          tajwid?: number
          tartil?: number
          urutan?: number
        }
        Relationships: [
          {
            foreignKeyName: "progres_pekanan_murid_id_fkey"
            columns: ["murid_id"]
            isOneToOne: false
            referencedRelation: "murid"
            referencedColumns: ["id"]
          },
        ]
      }
      riwayat_pekanan: {
        Row: {
          catatan: string
          created_at: string
          fokus: string[]
          id: string
          materi: string
          murid_id: string
          pekan: string
          tanggal: string
        }
        Insert: {
          catatan?: string
          created_at?: string
          fokus?: string[]
          id?: string
          materi: string
          murid_id: string
          pekan: string
          tanggal: string
        }
        Update: {
          catatan?: string
          created_at?: string
          fokus?: string[]
          id?: string
          materi?: string
          murid_id?: string
          pekan?: string
          tanggal?: string
        }
        Relationships: [
          {
            foreignKeyName: "riwayat_pekanan_murid_id_fkey"
            columns: ["murid_id"]
            isOneToOne: false
            referencedRelation: "murid"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_score: {
        Row: {
          id: string
          kelancaran: number
          murid_id: string
          pengucapan: number
          tajwid: number
          tartil: number
          updated_at: string
        }
        Insert: {
          id?: string
          kelancaran?: number
          murid_id: string
          pengucapan?: number
          tajwid?: number
          tartil?: number
          updated_at?: string
        }
        Update: {
          id?: string
          kelancaran?: number
          murid_id?: string
          pengucapan?: number
          tajwid?: number
          tartil?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_score_murid_id_fkey"
            columns: ["murid_id"]
            isOneToOne: true
            referencedRelation: "murid"
            referencedColumns: ["id"]
          },
        ]
      }
      surat_hafalan: {
        Row: {
          id: string
          jumlah_ayat: number
          juz: number
          kelancaran: number
          murid_id: string
          nama_surat: string
          nomor_surat: number
          updated_at: string
        }
        Insert: {
          id?: string
          jumlah_ayat?: number
          juz: number
          kelancaran?: number
          murid_id: string
          nama_surat: string
          nomor_surat: number
          updated_at?: string
        }
        Update: {
          id?: string
          jumlah_ayat?: number
          juz?: number
          kelancaran?: number
          murid_id?: string
          nama_surat?: string
          nomor_surat?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "surat_hafalan_murid_id_fkey"
            columns: ["murid_id"]
            isOneToOne: false
            referencedRelation: "murid"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      murid_level: "Pra-Tahsin" | "Tahsin" | "Tahfizh"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      murid_level: ["Pra-Tahsin", "Tahsin", "Tahfizh"],
    },
  },
} as const