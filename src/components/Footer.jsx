import { Box, Typography } from '@mui/material'

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: 'primary.main',
        color: 'white',
        p: 1,
        textAlign: 'center',
        zIndex: 1000,
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} CRM Moderno - Tutti i diritti riservati
      </Typography>
    </Box>
  )
}

export default Footer