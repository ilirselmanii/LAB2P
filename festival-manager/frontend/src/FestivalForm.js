import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const FestivalForm = ({ festival, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    EmriFestivalit: '',
    LlojiFestivalit: ''
  });

  useEffect(() => {
    if (festival) {
      setFormData({
        EmriFestivalit: festival.EmriFestivalit || '',
        LlojiFestivalit: festival.LlojiFestivalit || ''
      });
    }
  }, [festival]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {festival ? 'Edit Festival' : 'Add New Festival'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Festival Name"
          name="EmriFestivalit"
          value={formData.EmriFestivalit}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Festival Type"
          name="LlojiFestivalit"
          value={formData.LlojiFestivalit}
          onChange={handleChange}
          required
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            {festival ? 'Update' : 'Add'} Festival
          </Button>
          {onCancel && (
            <Button 
              variant="outlined" 
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default FestivalForm;
