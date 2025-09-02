import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Box, 
  Typography, 
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import EventForm from './EventForm';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [selectedFestival, setSelectedFestival] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchEvents = async (festivalId = '') => {
    try {
      const url = festivalId 
        ? `http://localhost:5000/api/events?festivalId=${festivalId}`
        : 'http://localhost:5000/api/events';
      
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchFestivals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events/festivals');
      const data = await response.json();
      setFestivals(data);
    } catch (error) {
      console.error('Error fetching festivals:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchFestivals();
  }, []);

  const handleSave = async (eventData) => {
    const url = editingEvent 
      ? `http://localhost:5000/api/events/${editingEvent.ID}`
      : 'http://localhost:5000/api/events';
    
    const method = editingEvent ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (response.ok) {
        fetchEvents(selectedFestival);
        setShowForm(false);
        setEditingEvent(null);
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchEvents(selectedFestival);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleFestivalChange = (e) => {
    const festivalId = e.target.value;
    setSelectedFestival(festivalId);
    fetchEvents(festivalId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h5">Events</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="festival-filter-label">Filter by Festival</InputLabel>
            <Select
              labelId="festival-filter-label"
              id="festival-filter"
              value={selectedFestival}
              onChange={handleFestivalChange}
              label="Filter by Festival"
            >
              <MenuItem value="">All Festivals</MenuItem>
              {festivals.map((festival) => (
                <MenuItem key={festival.ID} value={festival.ID}>
                  {festival.EmriFestivalit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              setEditingEvent(null);
              setShowForm(true);
            }}
          >
            Add Event
          </Button>
        </Box>
      </Box>

      {showForm && (
        <EventForm 
          event={editingEvent} 
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        />
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Festival</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.ID}>
                <TableCell>{event.EmriEventit}</TableCell>
                <TableCell>{formatDate(event.Data)}</TableCell>
                <TableCell>{event.Ora}</TableCell>
                <TableCell>
                  {event.Festival ? event.Festival.EmriFestivalit : 'N/A'}
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => {
                      setEditingEvent(event);
                      setShowForm(true);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(event.ID)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EventList;
