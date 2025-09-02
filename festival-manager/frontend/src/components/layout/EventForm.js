import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  MenuItem,
  InputLabel,
  FormControl,
  Select
} from '@mui/material';

const EventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    EmriEventit: '',
    Data: '',
    Ora: '12:00',
    ID_Festivali: ''
  });
  
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    // Fetch festivals for the dropdown
    const fetchFestivals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events/festivals');
        const data = await response.json();
        setFestivals(data);
      } catch (error) {
        console.error('Error fetching festivals:', error);
      }
    };

    fetchFestivals();

    // If editing an existing event, set the form data
    if (event) {
      // Format date for the date input (YYYY-MM-DD)
      const eventDate = event.Data ? new Date(event.Data).toISOString().split('T')[0] : '';
      
      setFormData({
        EmriEventit: event.EmriEventit || '',
        Data: eventDate,
        Ora: event.Ora || '12:00',
        ID_Festivali: event.ID_Festivali || ''
      });
    }
  }, [event]);

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
        {event ? 'Edit Event' : 'Add New Event'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="festival-select-label">Festival</InputLabel>
          <Select
            labelId="festival-select-label"
            id="ID_Festivali"
            name="ID_Festivali"
            value={formData.ID_Festivali}
            label="Festival"
            onChange={handleChange}
            required
          >
            {festivals.map((festival) => (
              <MenuItem key={festival.ID} value={festival.ID}>
                {festival.EmriFestivalit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Event Name"
          name="EmriEventit"
          value={formData.EmriEventit}
          onChange={handleChange}
          required
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Date"
            type="date"
            name="Data"
            value={formData.Data}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Time"
            type="time"
            name="Ora"
            value={formData.Ora}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            required
          />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            {event ? 'Update' : 'Add'} Event
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

export default EventForm;
