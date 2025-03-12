import { createClient } from '@supabase/supabase-js'
import Config from 'react-native-config';

const supabaseUrl = Config.VITE_SUPABASE_URL
const supabaseAnonKey = Config.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
    supabaseUrl ?? '',
    supabaseAnonKey ?? ''
)
