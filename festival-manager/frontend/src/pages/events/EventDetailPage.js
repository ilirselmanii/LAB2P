import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Divider, Chip, Grid, Card, CardContent,
  CardHeader, Avatar, IconButton, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Event as EventIcon, 
  LocationOn as LocationIcon, People as PeopleIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import axios from 'axios';
import { format, parseISO, isAfter, isBefore, formatDistanceToNow } from 'date-fns';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      setDeleteDialogOpen(false);
      navigate('/events');
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setDeleting(false);
    }
  };

  const getEventStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (now < start) return { label: 'Upcoming', color: 'primary' };
    if (now > end) return { label: 'Completed', color: 'default' };
    return { label: 'Happening Now', color: 'success' };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box p={3}>
        <Typography variant="h5">Event not found</Typography>
        <Button component={Link} to="/events" sx={{ mt: 2 }}>
          Back to Events
        </Button>
      </Box>
    );
  }

  const status = getEventStatus(event.startTime, event.endTime);
  const startDate = parseISO(event.startTime);
  const endDate = parseISO(event.endTime);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {event.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Chip 
              label={status.label} 
              color={status.color} 
              size="small" 
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {event.Festival?.name ? `Part of ${event.Festival.name}` : 'No associated festival'}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/events/${event.id}/edit`}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Event Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              {event.description || 'No description provided.'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader 
              title="Event Information"
              titleTypographyProps={{ variant: 'h6' }}
              sx={{ bgcolor: 'action.hover', py: 1 }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <EventIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2">Event Type</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.type || 'Not specified'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', mb: 2 }}>
                <CalendarIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2">Date & Time</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(startDate, 'PPP p')} - {format(endDate, 'p')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({formatDistanceToNow(startDate, { addSuffix: true })})
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', mb: 2 }}>
                <LocationIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2">Location</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.location || 'Not specified'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex' }}>
                <PeopleIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2">Capacity</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.capacity > 0 ? `${event.capacity} people` : 'Unlimited'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {event.Festival && (
            <Card variant="outlined">
              <CardHeader 
                title="Festival Information"
                titleTypographyProps={{ variant: 'h6' }}
                sx={{ bgcolor: 'action.hover', py: 1 }}
              />
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>Festival</Typography>
                <Typography variant="body1" paragraph>
                  {event.Festival.name}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>Description</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.Festival.description || 'No description available.'}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  component={Link} 
                  to={`/festivals/${event.Festival.id}`}
                  fullWidth
                >
                  View Festival
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventDetailPage;
