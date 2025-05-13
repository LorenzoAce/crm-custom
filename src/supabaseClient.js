import { createClient } from '@supabase/supabase-js'

const supabaseUrl = `https://wuezkufzqmsmqgsttncp.supabase.co`
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1ZXprdWZ6cW1zbXFnc3R0bmNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzIwNjIsImV4cCI6MjA2MjcwODA2Mn0.nZSRSkECpS43-QoBv2YlYdjpjefQGU4d1YE-9d14r24'

export const supabase = createClient(supabaseUrl, supabaseKey)