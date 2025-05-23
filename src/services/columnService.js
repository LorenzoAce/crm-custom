import { supabase } from '../supabaseClient'

// Funzione per ottenere tutte le colonne
export const getColumns = async () => {
  try {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      console.error('Errore durante il recupero delle colonne:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Errore durante il recupero delle colonne:', error.message)
    throw error
  }
}

// Funzione per aggiungere una nuova colonna
export const addColumn = async (columnData) => {
  try {
    if (!columnData.id || !columnData.label) {
      throw new Error("I campi 'id' e 'label' sono obbligatori.")
    }

    const { data, error } = await supabase
      .from('columns')
      .insert([columnData])
      .select()

    if (error) {
      console.error('Errore durante l\'aggiunta della colonna:', error)
      throw error
    }

    return data?.[0] || null
  } catch (error) {
    console.error('Errore durante l\'aggiunta della colonna:', error.message)
    throw error
  }
}

// Funzione per aggiornare una colonna esistente
export const updateColumn = async (id, columnData) => {
  try {
    const { data, error } = await supabase
      .from('columns')
      .update(columnData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Errore durante l\'aggiornamento della colonna:', error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della colonna:', error.message)
    throw error
  }
}

// Funzione per eliminare una colonna
export const deleteColumn = async (id) => {
  try {
    const { error } = await supabase
      .from('columns')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Errore durante l\'eliminazione della colonna:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Errore durante l\'eliminazione della colonna:', error.message)
    throw error
  }
}

// Funzione per sincronizzare tutte le colonne
export const syncColumns = async (columns) => {
  try {
    // Prima elimina tutte le colonne esistenti
    const { error: deleteError } = await supabase
      .from('columns')
      .delete()
      .neq('id', 'placeholder') // Elimina tutte le righe

    if (deleteError) {
      console.error('Errore durante l\'eliminazione delle colonne esistenti:', deleteError)
      throw deleteError
    }

    // Poi inserisci le nuove colonne
    if (columns.length > 0) {
      const { error: insertError } = await supabase
        .from('columns')
        .insert(columns)

      if (insertError) {
        console.error('Errore durante l\'inserimento delle nuove colonne:', insertError)
        throw insertError
      }
    }

    return true
  } catch (error) {
    console.error('Errore durante la sincronizzazione delle colonne:', error.message)
    throw error
  }
}