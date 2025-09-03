import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { format, parseISO, isAfter, isBefore, isWithinInterval } from 'date-fns';
import axios from 'axios';

const FestivalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [festival, setFestival] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        setLoading(true);
        const [festivalRes, eventsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/festivals/${id}`),
          axios.get(`http://localhost:5000/api/events?festivalId=${id}`),
        ]);
        
        setFestival(festivalRes.data);
        setEvents(eventsRes.data);
      } catch (error) {
        console.error('Error fetching festival details:', error);
        // Handle error (e.g., show error message)
      } finally {
        setLoading(false);
        setEventsLoading(false);
      }
    };

    fetchFestival();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditFestival = () => {
    navigate(`/festivals/${id}/edit`);
  };

  const handleDeleteFestival = async () => {
    if (window.confirm('Are you sure you want to delete this festival? This action cannot be undone.')) {
      try {
        setDeleting(true);
        await axios.delete(`http://localhost:5000/api/festivals/${id}`);
        navigate('/festivals');
      } catch (error) {
        console.error('Error deleting festival:', error);
        // Handle error (e.g., show error message)
      } finally {
        setDeleting(false);
      }
    }
  };

  const getFestivalStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isBefore(today, start)) return 'Upcoming';
    if (isAfter(today, end)) return 'Completed';
    return 'Ongoing';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'info';
      case 'Ongoing':
        return 'success';
      case 'Completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDateRange = (start, end) => {
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    
    if (format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
      return format(startDate, 'MMMM d, yyyy');
    }
    
    if (format(startDate, 'MMMM yyyy') === format(endDate, 'MMMM yyyy')) {
      return `${format(startDate, 'MMMM d')} - ${format(endDate, 'd, yyyy')}`;
    }
    
    return `${format(startDate, 'MMMM d, yyyy')} - ${format(endDate, 'MMMM d, yyyy')}`;
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => isAfter(parseISO(event.startTime), today))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  };

  const getPastEvents = () => {
    const today = new Date();
    return events
      .filter(event => isBefore(parseISO(event.endTime), today))
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  };

  const getCurrentEvents = () => {
    const today = new Date();
    return events.filter(event => {
      const start = parseISO(event.startTime);
      const end = parseISO(event.endTime);
      return isWithinInterval(today, { start, end });
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (!festival) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Festival not found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/festivals"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Festivals
        </Button>
      </Container>
    );
  }

  const status = getFestivalStatus(festival.startDate, festival.endDate);
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();
  const currentEvents = getCurrentEvents();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Festivals
        </Button>

        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Box sx={{ p: 4, bgcolor: 'primary.main', color: 'white' }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {festival.name}
                </Typography>
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} mb={1}>
                  <Chip
                    label={festival.type}
                    color="secondary"
                    size="small"
                    sx={{ color: 'white' }}
                  />
                  <Chip
                    label={status}
                    color={getStatusColor(status)}
                    variant="outlined"
                    size="small"
                    sx={{ color: 'white', borderColor: 'white' }}
                  />
                </Box>
              </Box>
              <Box>
                <Tooltip title="Edit Festival">
                  <IconButton
                    onClick={handleEditFestival}
                    sx={{ color: 'white', mr: 1 }}
                    disabled={deleting}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Festival">
                  <IconButton
                    onClick={handleDeleteFestival}
                    sx={{ color: 'white' }}
                    disabled={deleting}
                  >
                    {deleting ? <CircularProgress size={24} /> : <DeleteIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Box mb={4}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ mr: 1 }} />
                    About This Festival
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {festival.description || 'No description available.'}
                  </Typography>
                </Box>

                <Box mb={4}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ mr: 1 }} />
                    Event Schedule
                  </Typography>
                  
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ mb: 2 }}
                  >
                    <Tab label={`Upcoming (${upcomingEvents.length})`} />
                    <Tab label={`Happening Now (${currentEvents.length})`} />
                    <Tab label={`Past Events (${pastEvents.length})`} />
                  </Tabs>

                  {eventsLoading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box minHeight={200}>
                      {tabValue === 0 && (
                        <EventList events={upcomingEvents} emptyMessage="No upcoming events scheduled." />
                      )}
                      {tabValue === 1 && (
                        <EventList events={currentEvents} emptyMessage="No events happening right now." />
                      )}
                      {tabValue === 2 && (
                        <EventList events={pastEvents} emptyMessage="No past events found." />
                      )}
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardHeader title="Festival Details" />
                  <Divider />
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Date"
                          secondary={formatDateRange(festival.startDate, festival.endDate)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <LocationIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Location"
                          secondary={festival.location || 'Not specified'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <EventIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Total Events"
                          secondary={events.length}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<AddIcon />}
                  component={Link}
                  to={`/events/new?festivalId=${festival.id}`}
                  sx={{ mb: 2 }}
                >
                  Add New Event
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  component={Link}
                  to={`/events?festivalId=${festival.id}`}
                >
                  View All Events
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

const EventList = ({ events, emptyMessage }) => {
  const navigate = useNavigate();

  if (events.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="textSecondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Event</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.id}
              hover
              onClick={() => navigate(`/events/${event.id}`)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Typography variant="subtitle2">{event.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {format(parseISO(event.startTime), 'MMM d, h:mm a')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="textSecondary">
                  {event.location}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FestivalDetailPage;
