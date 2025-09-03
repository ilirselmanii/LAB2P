import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Container } from '@mui/material';
import EventForm from '../../components/EventForm';
import axios from 'axios';

const AddEventPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (formData) => {
    try {
      setIsSubmitting(true);
      // Combine date and time into a single datetime string
      const eventData = {
        ...formData,
        Data: `${formData.Data}T${formData.Ora}:00`
      };
      
      await axios.post('http://localhost:5000/api/events', eventData);
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/events');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Event
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <EventForm 
            onSave={handleSave}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default AddEventPage;
