import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            © {new Date().getFullYear()} Festival Manager
          </Typography>
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Link
              component={RouterLink}
              to="/about"
              color="text.secondary"
              sx={{ mr: 2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              About
            </Link>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              sx={{ mr: 2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
