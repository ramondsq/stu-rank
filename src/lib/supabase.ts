import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Student {
  id: number
  name: string
  created_at: string
}

export interface Score {
  id: number
  student_id: number
  score: number
  date: string
  created_at: string
  updated_at: string
  student: Student
}

export interface StudentWithTotalScore {
  id: number
  name: string
  total_score: number
  score_count: number
  latest_date: string | null
}
