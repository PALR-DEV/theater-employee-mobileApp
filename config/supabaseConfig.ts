import { createClient } from '@supabase/supabase-js'
import Config from 'react-native-config';

const supabaseUrl = 'https://mrsrpfrlyryrjiryumrc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc3JwZnJseXJ5cmppcnl1bXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMDM5MDYsImV4cCI6MjA1NjY3OTkwNn0.1GCFlwNol9FfgZinVpglbDkhPUA3VFk0uKP_0nuLc00'

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey 
)
