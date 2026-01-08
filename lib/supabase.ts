import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,       // Isso obriga a criar a storage key
      storageKey: 'clinica-auth-token', // Nome que você vai procurar no F12
      autoRefreshToken: true,     // Renova o login sozinho
      detectSessionInUrl: true    // Importante para logins sociais ou recuperação
    }
  }
);