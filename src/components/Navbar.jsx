import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Tooltip,
} from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

function Navbar({ onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  const [openProfileDialog, setOpenProfileDialog] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [username, setUsername] = useState('Admin') // Placeholder, da sostituire con dati reali
  const [fileInput, setFileInput] = useState(null)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handlePasswordChange = () => {
    // TODO: Implementare la logica per il cambio password
    setNewPassword('')
    setOpenPasswordDialog(false)
    handleClose()
  }

  const handleProfileUpdate = () => {
    // TODO: Implementare la logica per l'aggiornamento del profilo
    setOpenProfileDialog(false)
    handleClose()
  }

  // Funzione per esportare i contatti in formato CSV
  const handleExportCSV = () => {
    // Otteniamo i contatti dal localStorage o da un'API
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]')
    
    if (contacts.length === 0) {
      alert('Non ci sono contatti da esportare')
      return
    }
    
    // Otteniamo le intestazioni dalle chiavi del primo contatto
    const headers = Object.keys(contacts[0])
    
    // Creiamo le righe CSV
    const csvRows = [
      headers.join(','), // Riga delle intestazioni
      ...contacts.map(contact => {
        return headers.map(header => {
          // Gestiamo i valori che potrebbero contenere virgole
          const value = contact[header] || ''
          const escaped = ('' + value).replace(/"/g, '""')
          return `"${escaped}"`
        }).join(',')
      })
    ]
    
    // Uniamo le righe con un newline
    const csvContent = csvRows.join('\n')
    
    // Creiamo un blob e un link per il download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'contatti.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Funzione per importare i contatti da un file CSV
  const handleImportCSV = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      const rows = content.split('\n')
      
      if (rows.length < 2) {
        alert('Il file CSV non contiene dati validi')
        return
      }
      
      // Otteniamo le intestazioni dalla prima riga
      const headers = rows[0].split(',').map(header => header.trim().replace(/"/g, ''))
      
      // Convertiamo le righe in oggetti
      const contacts = []
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue // Saltiamo le righe vuote
        
        // Gestiamo correttamente le virgole all'interno delle stringhe tra virgolette
        const values = []
        let inQuotes = false
        let currentValue = ''
        
        for (let char of rows[i]) {
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === ',' && !inQuotes) {
            values.push(currentValue.trim())
            currentValue = ''
          } else {
            currentValue += char
          }
        }
        values.push(currentValue.trim()) // Aggiungiamo l'ultimo valore
        
        // Creiamo l'oggetto contatto
        const contact = {}
        headers.forEach((header, index) => {
          contact[header] = values[index] ? values[index].replace(/"/g, '') : ''
        })
        
        // Aggiungiamo un ID se non presente
        if (!contact.id) {
          contact.id = Date.now().toString() + i
        }
        
        contacts.push(contact)
      }
      
      // Salviamo i contatti nel localStorage o li inviamo a un'API
      const existingContacts = JSON.parse(localStorage.getItem('contacts') || '[]')
      const mergedContacts = [...existingContacts, ...contacts]
      localStorage.setItem('contacts', JSON.stringify(mergedContacts))
      
      alert(`Importati ${contacts.length} contatti con successo`)
      
      // Reset del campo file
      if (fileInput) {
        fileInput.value = ''
      }
    }
    
    reader.readAsText(file)
  }
  
  // Riferimento all'input file nascosto
  const handleFileInputRef = (input) => {
    setFileInput(input)
  }
  
  // Trigger per aprire il selettore di file
  const triggerFileInput = () => {
    if (fileInput) {
      fileInput.click()
    }
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CRM Moderno
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Importa CSV">
            <IconButton color="inherit" onClick={triggerFileInput}>
              <FileUploadIcon />
            </IconButton>
          </Tooltip>
          <input
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={handleImportCSV}
            ref={handleFileInputRef}
          />
          <Tooltip title="Esporta CSV">
            <IconButton color="inherit" onClick={handleExportCSV}>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            {username}
          </Typography>
          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
          >
            {avatarUrl ? (
              <Avatar src={avatarUrl} />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => {
            handleClose()
            setOpenProfileDialog(true)
          }}>
            Modifica Profilo
          </MenuItem>
          <MenuItem onClick={() => {
            handleClose()
            setOpenPasswordDialog(true)
          }}>
            Cambia Password
          </MenuItem>
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>

        <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
          <DialogTitle>Cambia Password</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Nuova Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordDialog(false)}>Annulla</Button>
            <Button onClick={handlePasswordChange} variant="contained">
              Salva
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)}>
          <DialogTitle>Modifica Profilo</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="URL Immagine Profilo"
              fullWidth
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenProfileDialog(false)}>Annulla</Button>
            <Button onClick={handleProfileUpdate} variant="contained">
              Salva
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar