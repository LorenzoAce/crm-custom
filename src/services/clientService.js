import { supabase } from '../supabaseClient'

// Funzione per ottenere tutti i clienti
export const getClients = async () => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('ragioneSociale', { ascending: true })

    if (error) {
      console.error('Errore durante il recupero dei clienti:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Errore durante il recupero dei clienti:', error.message)
    throw error
  }
}

// Funzione per aggiungere un nuovo cliente
export const addClient = async (clientData) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()

    if (error) {
      console.error('Errore durante l\'aggiunta del cliente:', error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error('Errore durante l\'aggiunta del cliente:', error.message)
    throw error
  }
}

// Funzione per aggiornare un cliente esistente
export const updateClient = async (id, clientData) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Errore durante l\'aggiornamento del cliente:', error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del cliente:', error.message)
    throw error
  }
}

// Funzione per eliminare un cliente
export const deleteClient = async (id) => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Errore durante l\'eliminazione del cliente:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Errore durante l\'eliminazione del cliente:', error.message)
    throw error
  }
}