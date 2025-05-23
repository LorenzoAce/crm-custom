import { createClient } from '@supabase/supabase-js'

const supabaseUrl = `https://hqjuszrpysdonvfcvcsa.supabase.co`
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxanVzenJweXNkb252ZmN2Y3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzI0NDksImV4cCI6MjA2MzUwODQ0OX0.ZS66R_9bXPrV2jlMlWw4M-bCyuBHD8Nih9TgpJf9wW0'

export const supabase = createClient(supabaseUrl, supabaseKey)
