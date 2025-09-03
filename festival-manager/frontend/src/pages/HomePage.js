import React from 'react';
import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FestivalIcon from '@mui/icons-material/Festival';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const HomePage = () => {
  const features = [
    {
      icon: <FestivalIcon fontSize="large" color="primary" />,
      title: 'Manage Festivals',
      description: 'Create and manage all your festivals in one place. Keep track of dates, locations, and details.',
      buttonText: 'View Festivals',
      path: '/festivals'
    },
    {
      icon: <EventIcon fontSize="large" color="primary" />,
      title: 'Organize Events',
      description: 'Plan and schedule events within your festivals. Manage schedules, venues, and more.',
      buttonText: 'View Events',
      path: '/events'
    },
    {
      icon: <CalendarTodayIcon fontSize="large" color="primary" />,
      title: 'Stay Organized',
      description: 'Keep everything organized with our intuitive interface and powerful tools.',
      buttonText: 'Get Started',
      path: '/festivals'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Festival Manager
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Your all-in-one solution for managing festivals and events
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              component={RouterLink}
              to="/festivals"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
            >
              Explore Festivals
            </Button>
            <Button
              component={RouterLink}
              to="/events"
              variant="outlined"
              color="inherit"
              size="large"
            >
              Browse Events
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {feature.description}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={feature.path}
                    variant="outlined"
                    color="primary"
                  >
                    {feature.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: 'grey.100',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Join thousands of event organizers who trust Festival Manager to make their events a success.
          </Typography>
          <Button
            component={RouterLink}
            to="/festivals/new"
            variant="contained"
            color="primary"
            size="large"
          >
            Create Your First Festival
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
