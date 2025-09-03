import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  CircularProgress,
  Button 
} from '@mui/material';
import FestivalForm from '../../components/FestivalForm';
import axios from 'axios';

const EditFestivalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/festivals/${id}`);
        setFestival(response.data);
      } catch (error) {
        console.error('Error fetching festival:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFestival();
  }, [id]);

  const handleSave = async (festivalData) => {
    try {
      setSaving(true);
      await axios.put(`http://localhost:5000/api/festivals/${id}`, festivalData);
      navigate('/festivals');
    } catch (error) {
      console.error('Error updating festival:', error);
      alert('Failed to update festival. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/festivals');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!festival) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Festival not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/festivals')}
          sx={{ mt: 2 }}
        >
          Back to Festivals
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Festival
        </Typography>
        <FestivalForm 
          festival={festival}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={saving}
        />
      </Box>
    </Container>
  );
};

export default EditFestivalPage;
