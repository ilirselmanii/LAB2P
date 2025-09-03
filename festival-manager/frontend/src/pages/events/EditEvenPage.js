import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Container } from '@mui/material';
import EventForm from '../../components/EventForm';
import axios from 'axios';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        alert('Failed to load event data');
        navigate('/events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleSave = async (formData) => {
    try {
      setIsSubmitting(true);
      // Combine date and time into a single datetime string
      const eventData = {
        ...formData,
        Data: `${formData.Data}T${formData.Ora}:00`
      };
      
      await axios.put(`http://localhost:5000/api/events/${id}`, eventData);
      navigate('/events');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/events');
  };

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography>Loading event data...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Event
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <EventForm 
            event={event}
            onSave={handleSave}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            isEdit={true}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default EditEventPage;
