import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Paper, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, IconButton,
  Chip, Grid, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`);
        setEvents(events.filter(event => event.ID !== id));
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getEventStatus = (dateString) => {
    if (!dateString) return { label: 'Unknown', color: 'default' };
    
    const now = new Date();
    const eventDate = new Date(dateString);
    
    if (isNaN(eventDate.getTime())) {
      return { label: 'Invalid Date', color: 'error' };
    }
    
    const endOfDay = new Date(eventDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    if (now < eventDate) {
      return { label: 'Upcoming', color: 'primary' };
    } else if (now > endOfDay) {
      return { label: 'Completed', color: 'default' };
    } else {
      return { label: 'Today', color: 'success' };
    }
  };

  const filteredEvents = events.filter(event => {
    const eventName = event.EmriEventit || '';
    const eventDate = event.Data ? new Date(event.Data).toLocaleDateString() : '';
    
    const matchesSearch = eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eventDate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const eventStart = event.Data ? new Date(event.Data) : null;
    
    if (!eventStart || isNaN(eventStart.getTime())) {
      return matchesSearch;
    }
    
    let matchesStatus = true;
    if (statusFilter === 'upcoming') {
      matchesStatus = eventStart > now;
    } else if (statusFilter === 'ongoing') {
      const endOfDay = new Date(eventStart);
      endOfDay.setHours(23, 59, 59, 999);
      matchesStatus = eventStart <= now && now <= endOfDay;
    } else if (statusFilter === 'past') {
      matchesStatus = eventStart < now;
    }
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Events</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/events/new')}
        >
          Add Event
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Events</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="past">Past</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event Name</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading events...
                  </TableCell>
                </TableRow>
              ) : filteredEvents.length > 0 ? (
                filteredEvents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => {
                    const status = getEventStatus(event.Data);
                    return (
                      <TableRow key={event.ID} hover>
                        <TableCell>{event.EmriEventit || 'Unnamed Event'}</TableCell>
                        <TableCell>
                          {formatDate(event.Data)}
                          {event.Ora && ` at ${event.Ora}`}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={status.label} 
                            color={status.color} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            component={Link} 
                            to={`/events/${event.ID}/edit`}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(event.ID)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEvents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default EventsPage;