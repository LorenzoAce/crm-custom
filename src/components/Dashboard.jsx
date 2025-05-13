import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Fab,
  MenuItem,
  Typography,
  InputAdornment,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

const initialColumns = [
  { id: 'ragioneSociale', label: 'R.Sociale', order: 1, options: [] },
  { id: 'categoria', label: 'Categoria', order: 2, options: ['Cliente', 'Fornitore', 'Partner'] },
  { id: 'indirizzo', label: 'Indirizzo', order: 3, options: [] },
  { id: 'citta', label: 'Città', order: 4, options: [] },
  { id: 'provincia', label: 'Provincia', order: 5, options: [] },
  { id: 'telefono', label: 'Telefono', order: 6, options: [] },
  { id: 'cellulare', label: 'Cell', order: 7, options: [] },
]

function Dashboard() {
  const [contacts, setContacts] = useState([])
  const [columns, setColumns] = useState(initialColumns)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [newColumn, setNewColumn] = useState({ id: '', label: '', order: 0, options: [] })
  const [openColumnDialog, setOpenColumnDialog] = useState(false)
  const [editingColumn, setEditingColumn] = useState(null)
  const [openEditColumnDialog, setOpenEditColumnDialog] = useState(false)
  const [newOption, setNewOption] = useState('')
  const [editingOption, setEditingOption] = useState('')
  const [searchText, setSearchText] = useState('')
  const [selectedColumns, setSelectedColumns] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])

  const handleAddColumn = () => {
    if (newColumn.label) {
      const newColumnWithOrder = {
        ...newColumn,
        id: newColumn.label.toLowerCase(),
        order: newColumn.order || columns.length + 1,
        options: newColumn.options || []
      }
      const sortedColumns = [...columns, newColumnWithOrder].sort((a, b) => a.order - b.order)
      setColumns(sortedColumns)
      setNewColumn({ id: '', label: '', order: 0, options: [] })
      setOpenColumnDialog(false)
    }
  }

  const handleEditColumn = (column) => {
    setEditingColumn(column)
    setOpenEditColumnDialog(true)
  }

  const handleSaveColumnEdit = () => {
    if (editingColumn) {
      setColumns(columns.map(col => 
        col.id === editingColumn.id ? editingColumn : col
      ))
      setEditingColumn(null)
      setOpenEditColumnDialog(false)
    }
  }

  const handleOpenDialog = (contact = null) => {
    setEditingContact(contact || {})
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setEditingContact(null)
    setOpenDialog(false)
  }

  // Carica i contatti dal localStorage all'avvio
  useEffect(() => {
    const savedContacts = JSON.parse(localStorage.getItem('contacts') || '[]')
    if (savedContacts.length > 0) {
      setContacts(savedContacts)
    }
  }, [])

  // Salva i contatti nel localStorage quando cambiano
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('contacts', JSON.stringify(contacts))
    }
  }, [contacts])

  const handleSaveContact = () => {
    if (editingContact.id) {
      setContacts(contacts.map(c => c.id === editingContact.id ? editingContact : c))
    } else {
      setContacts([...contacts, { ...editingContact, id: Date.now().toString() }])
    }
    handleCloseDialog()
  }

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id))
  }

  const handleDuplicateContact = (contact) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
      ragioneSociale: `${contact.ragioneSociale} (Copia)`,
    }
    setContacts([...contacts, newContact])
  }

  // Gestisce il cambiamento del testo di ricerca
  const handleSearchChange = (value) => {
    setSearchText(value)
  }

  // Gestisce il cambiamento delle colonne selezionate per la ricerca
  const handleColumnSelectionChange = (columnId) => {
    setSelectedColumns(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId)
      } else {
        return [...prev, columnId]
      }
    })
  }
  
  // Filtra i contatti in base al testo di ricerca e alle colonne selezionate
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredContacts(contacts)
      return
    }

    const columnsToSearch = selectedColumns.length > 0 ? selectedColumns : columns.map(col => col.id)
    const searchValue = searchText.toLowerCase()
    
    const result = contacts.filter(contact => {
      return columnsToSearch.some(columnId => {
        const contactValue = String(contact[columnId] || '').toLowerCase()
        return contactValue.includes(searchValue)
      })
    })
    
    setFilteredContacts(result)
  }, [contacts, searchText, selectedColumns, columns])

  return (
    <Box sx={{ position: 'relative', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barra di ricerca globale */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            label="Ricerca globale"
            placeholder="Inserisci il testo da cercare"
            size="small"
            sx={{ mr: 2, minWidth: 300 }}
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchText ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleSearchChange('')}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
          />
          <Typography variant="subtitle2" sx={{ mr: 2 }}>
            Colonne da cercare:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {columns.map((column) => (
              <Button 
                key={column.id}
                size="small"
                variant={selectedColumns.includes(column.id) ? "contained" : "outlined"}
                onClick={() => handleColumnSelectionChange(column.id)}
                sx={{ minWidth: 'auto', px: 1 }}
              >
                {column.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {/* Riga delle intestazioni */}
            {/* Riga delle intestazioni */}
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {column.label}
                    <IconButton
                      size="small"
                      onClick={() => handleEditColumn(column)}
                      sx={{ ml: 1 }}
                    >
                      <ModeEditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              ))}
              <TableCell align="right">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(filteredContacts.length > 0 ? filteredContacts : contacts).map((contact) => (
              <TableRow key={contact.id}>
                {columns.map((column) => (
                  <TableCell key={column.id}>{contact[column.id]}</TableCell>
                ))}
                <TableCell align="right">
                  <Tooltip title="Modifica">
                    <IconButton onClick={() => handleOpenDialog(contact)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Duplica">
                    <IconButton onClick={() => handleDuplicateContact(contact)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Elimina">
                    <IconButton onClick={() => handleDeleteContact(contact.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpenColumnDialog(true)}
        >
          Aggiungi Colonna
        </Button>
        
        <Fab
          color="primary"
          size="medium"
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingContact?.id ? 'Modifica Contatto' : 'Nuovo Contatto'}
        </DialogTitle>
        <DialogContent>
          {columns.map((column) => (
            column.options.length > 0 ? (
              <TextField
                key={column.id}
                margin="dense"
                label={column.label}
                fullWidth
                select
                value={editingContact?.[column.id] || ''}
                onChange={(e) =>
                  setEditingContact({
                    ...editingContact,
                    [column.id]: e.target.value,
                  })
                }
              >
                {column.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                key={column.id}
                margin="dense"
                label={column.label}
                fullWidth
                value={editingContact?.[column.id] || ''}
                onChange={(e) =>
                  setEditingContact({
                    ...editingContact,
                    [column.id]: e.target.value,
                  })
                }
              />
            )
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button onClick={handleSaveContact} variant="contained">
            Salva
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openColumnDialog} onClose={() => setOpenColumnDialog(false)}>
        <DialogTitle>Aggiungi Nuova Colonna</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Titolo Colonna"
            fullWidth
            value={newColumn.label}
            onChange={(e) =>
              setNewColumn({ ...newColumn, label: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Ordine"
            type="number"
            fullWidth
            value={newColumn.order}
            onChange={(e) =>
              setNewColumn({ ...newColumn, order: parseInt(e.target.value) || 0 })
            }
          />
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle2">Opzioni</Typography>
            {newColumn.options.map((option, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...newColumn.options];
                    updatedOptions[index] = e.target.value;
                    setNewColumn({ ...newColumn, options: updatedOptions });
                  }}
                />
                <IconButton 
                  onClick={() => {
                    const updatedOptions = newColumn.options.filter((_, i) => i !== index);
                    setNewColumn({ ...newColumn, options: updatedOptions });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                size="small"
                fullWidth
                label="Nuova opzione"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newOption.trim()) {
                    setNewColumn({
                      ...newColumn,
                      options: [...newColumn.options, newOption.trim()]
                    });
                    setNewOption('');
                    e.preventDefault();
                  }
                }}
              />
              <IconButton 
                onClick={() => {
                  if (newOption.trim()) {
                    setNewColumn({
                      ...newColumn,
                      options: [...newColumn.options, newOption.trim()]
                    });
                    setNewOption('');
                  }
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenColumnDialog(false)}>Annulla</Button>
          <Button onClick={handleAddColumn} variant="contained">
            Aggiungi
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditColumnDialog} onClose={() => setOpenEditColumnDialog(false)}>
        <DialogTitle>Modifica Colonna</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Etichetta Colonna"
            fullWidth
            value={editingColumn?.label || ''}
            onChange={(e) => {
              const newLabel = e.target.value
              setEditingColumn({
                ...editingColumn,
                label: newLabel,
                id: newLabel.toLowerCase()
              })
            }}
          />
          <TextField
            margin="dense"
            label="Ordine"
            type="number"
            fullWidth
            value={editingColumn?.order || 0}
            onChange={(e) =>
              setEditingColumn({ ...editingColumn, order: parseInt(e.target.value) || 0 })
            }
          />
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle2">Opzioni</Typography>
            {editingColumn?.options?.map((option, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...editingColumn.options];
                    updatedOptions[index] = e.target.value;
                    setEditingColumn({ ...editingColumn, options: updatedOptions });
                  }}
                />
                <IconButton 
                  onClick={() => {
                    const updatedOptions = editingColumn.options.filter((_, i) => i !== index);
                    setEditingColumn({ ...editingColumn, options: updatedOptions });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                size="small"
                fullWidth
                label="Nuova opzione"
                value={editingOption}
                onChange={(e) => setEditingOption(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && editingOption.trim()) {
                    setEditingColumn({
                      ...editingColumn,
                      options: [...(editingColumn?.options || []), editingOption.trim()]
                    });
                    setEditingOption('');
                    e.preventDefault();
                  }
                }}
              />
              <IconButton 
                onClick={() => {
                  if (editingOption.trim()) {
                    setEditingColumn({
                      ...editingColumn,
                      options: [...(editingColumn?.options || []), editingOption.trim()]
                    });
                    setEditingOption('');
                  }
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditColumnDialog(false)}>Annulla</Button>
          <Button onClick={handleSaveColumnEdit} variant="contained">
            Salva
          </Button>
        </DialogActions>
      </Dialog>
      

    </Box>
  )
}

export default Dashboard