import { supabase } from '../supabaseClient'

// Funzione per effettuare il login con email e password
export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Errore durante il login:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Errore durante il login:', error.message)
    throw error
  }
}

// Funzione per effettuare il logout
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Errore durante il logout:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Errore durante il logout:', error.message)
    throw error
  }
}

// Funzione per ottenere l'utente corrente
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Errore durante il recupero dell\'utente:', error)
      throw error
    }

    return data?.user || null
  } catch (error) {
    console.error('Errore durante il recupero dell\'utente:', error.message)
    throw error
  }
}