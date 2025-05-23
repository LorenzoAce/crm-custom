import { supabase } from '../supabaseClient'

// Funzione per ottenere tutte le colonne direttamente dalla struttura della tabella clients
export const getColumns = async () => {
  try {
    // Ottiene la struttura della tabella clients
    const { data: tableData, error: tableError } = await supabase
      .rpc('get_table_columns', { table_name: 'clients' })

    if (tableError) {
      console.error('Errore durante il recupero della struttura della tabella:', tableError)
      
      // Se la funzione RPC non esiste o c'è un errore, restituisci le colonne predefinite
      console.log('Utilizzo delle colonne predefinite')
      return []
    }
    
    if (tableData && tableData.length > 0) {
      // Trasforma i dati della struttura della tabella nel formato delle colonne
      const columns = tableData
        .filter(col => col.column_name !== 'id' && col.column_name !== 'created_at')
        .map((col, index) => ({
          id: col.column_name,
          label: col.column_name.charAt(0).toUpperCase() + col.column_name.slice(1),
          order: index + 1,
          options: []
        }))
      
      return columns
    }
    
    return []
  } catch (error) {
    console.error('Errore durante il recupero delle colonne:', error.message)
    return []
  }
}

// Funzione per aggiungere una nuova colonna alla tabella clients
export const addColumn = async (columnData) => {
  try {
    if (!columnData.id || !columnData.label) {
      throw new Error("I campi 'id' e 'label' sono obbligatori.")
    }

    // Aggiungi la colonna alla tabella clients usando SQL
    const { error } = await supabase.rpc('add_column_to_clients', {
      column_name: columnData.id,
      column_type: 'text'
    })

    if (error) {
      console.error('Errore durante l\'aggiunta della colonna:', error)
      throw error
    }

    // Salva le informazioni sulla colonna in localStorage per mantenere le opzioni e altre proprietà
    try {
      const columnsJson = localStorage.getItem('clientColumns') || '[]'
      const columns = JSON.parse(columnsJson)
      columns.push(columnData)
      localStorage.setItem('clientColumns', JSON.stringify(columns))
    } catch (e) {
      console.error('Errore durante il salvataggio delle informazioni sulla colonna:', e)
    }

    return columnData
  } catch (error) {
    console.error('Errore durante l\'aggiunta della colonna:', error.message)
    throw error
  }
}

// Funzione per aggiornare una colonna esistente
export const updateColumn = async (id, columnData) => {
  try {
    // Se l'ID della colonna è cambiato, rinomina la colonna nella tabella clients
    if (id !== columnData.id) {
      const { error } = await supabase.rpc('rename_column_in_clients', {
        old_column_name: id,
        new_column_name: columnData.id
      })

      if (error) {
        console.error('Errore durante la rinomina della colonna:', error)
        throw error
      }
    }

    // Aggiorna le informazioni sulla colonna in localStorage
    try {
      const columnsJson = localStorage.getItem('clientColumns') || '[]'
      let columns = JSON.parse(columnsJson)
      columns = columns.map(col => col.id === id ? columnData : col)
      localStorage.setItem('clientColumns', JSON.stringify(columns))
    } catch (e) {
      console.error('Errore durante l\'aggiornamento delle informazioni sulla colonna:', e)
    }

    return columnData
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della colonna:', error.message)
    throw error
  }
}

// Funzione per eliminare una colonna
export const deleteColumn = async (id) => {
  try {
    // Elimina la colonna dalla tabella clients
    const { error } = await supabase.rpc('drop_column_from_clients', {
      column_name: id
    })

    if (error) {
      console.error('Errore durante l\'eliminazione della colonna:', error)
      throw error
    }

    // Rimuovi le informazioni sulla colonna da localStorage
    try {
      const columnsJson = localStorage.getItem('clientColumns') || '[]'
      let columns = JSON.parse(columnsJson)
      columns = columns.filter(col => col.id !== id)
      localStorage.setItem('clientColumns', JSON.stringify(columns))
    } catch (e) {
      console.error('Errore durante la rimozione delle informazioni sulla colonna:', e)
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
    // Salva le informazioni sulle colonne in localStorage
    localStorage.setItem('clientColumns', JSON.stringify(columns))
    
    // Ottieni la struttura attuale della tabella
    const { data: tableData, error: tableError } = await supabase
      .rpc('get_table_columns', { table_name: 'clients' })
      
    if (tableError) {
      console.error('Errore durante il recupero della struttura della tabella:', tableError)
      throw tableError
    }

    // Verifica quali colonne mancano nella tabella e aggiungile
    const existingColumns = tableData.map(col => col.column_name)
    
    for (const column of columns) {
      if (!existingColumns.includes(column.id) && column.id !== 'id' && column.id !== 'created_at') {
        // Aggiungi la colonna mancante
        const { error } = await supabase.rpc('add_column_to_clients', {
          column_name: column.id,
          column_type: 'text'
        })
        
        if (error) {
          console.error(`Errore durante l'aggiunta della colonna ${column.id}:`, error)
          // Continua con le altre colonne anche se questa fallisce
        }
      }
    }

    return true
  } catch (error) {
    console.error('Errore durante la sincronizzazione delle colonne:', error.message)
    throw error
  }
}