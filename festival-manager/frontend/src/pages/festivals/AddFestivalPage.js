import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import FestivalForm from '../../components/FestivalForm';
import axios from 'axios';

const AddFestivalPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSave = async (festivalData) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/festivals', festivalData);
      navigate('/festivals');
    } catch (error) {
      console.error('Error saving festival:', error);
      alert('Failed to save festival. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/festivals');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Festival
        </Typography>
        <FestivalForm 
          onSave={handleSave} 
          onCancel={handleCancel} 
          loading={loading} 
        />
      </Box>
    </Container>
  );
};

export default AddFestivalPage;
