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
  IconButton 
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import FestivalForm from './FestivalForm';

const FestivalList = () => {
  const [festivals, setFestivals] = useState([]);
  const [editingFestival, setEditingFestival] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchFestivals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/festivals');
      const data = await response.json();
      setFestivals(data);
    } catch (error) {
      console.error('Error fetching festivals:', error);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  const handleSave = async (festivalData) => {
    const url = editingFestival 
      ? `http://localhost:5000/api/festivals/${editingFestival.ID}`
      : 'http://localhost:5000/api/festivals';
    
    const method = editingFestival ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(festivalData),
      });
      
      if (response.ok) {
        fetchFestivals();
        setShowForm(false);
        setEditingFestival(null);
      }
    } catch (error) {
      console.error('Error saving festival:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this festival?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/festivals/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchFestivals();
        }
      } catch (error) {
        console.error('Error deleting festival:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Festivals</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            setEditingFestival(null);
            setShowForm(true);
          }}
        >
          Add Festival
        </Button>
      </Box>

      {showForm && (
        <FestivalForm 
          festival={editingFestival} 
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingFestival(null);
          }}
        />
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {festivals.map((festival) => (
              <TableRow key={festival.ID}>
                <TableCell>{festival.ID}</TableCell>
                <TableCell>{festival.EmriFestivalit}</TableCell>
                <TableCell>{festival.LlojiFestivalit}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => {
                      setEditingFestival(festival);
                      setShowForm(true);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(festival.ID)}>
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

export default FestivalList;
