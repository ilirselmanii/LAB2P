import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import FestivalsPage from './pages/festivals/FestivalsPage';
import FestivalDetailPage from './pages/festivals/FestivalDetailPage';
import AddFestivalPage from './pages/festivals/AddFestivalPage';
import EditFestivalPage from './pages/festivals/EditFestivalPage';
import EventsPage from './pages/events/EventsPage';
import EventDetailPage from './pages/events/EventDetailPage';
import AddEventPage from './pages/events/AddEventPage';
import EditEventPage from './pages/events/EditEventPage';
import NotFoundPage from './pages/NotFoundPage';
import { Box } from '@mui/material';
import FestivalList from './components/FestivalList';
import FestivalForm from './components/FestivalForm';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Container component="main" maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              {/* Festival Routes */}
              <Route path="/festivals" element={<FestivalsPage />} />
              <Route path="/festivals/new" element={<AddFestivalPage />} />
              <Route path="/festivals/:id" element={<FestivalDetailPage />} />
              <Route path="/festivals/:id/edit" element={<EditFestivalPage />} />
              <Route path="/festivals/list" element={<FestivalList />} />
              
              {/* Event Routes */}
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/new" element={<AddEventPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/events/:id/edit" element={<EditEventPage />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Container>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
