// Importa o cliente do Supabase usando a CDN oficial para JavaScript Vanilla
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// TODO: Substitua pelas credenciais REAIS do seu projeto no Supabase
// Você encontra isso em: Project Settings -> API (no painel do Supabase)
const SUPABASE_URL = 'https://yaeubembgsyyizaoiigu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZXViZW1iZ3N5eWl6YW9paWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjY5NTYsImV4cCI6MjA5Njg0Mjk1Nn0.pP3P9IjvyNmAoJSPnXrKHvfjNk_Z6UWgTWIPzcwopDM'

// Inicializa o cliente do Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)