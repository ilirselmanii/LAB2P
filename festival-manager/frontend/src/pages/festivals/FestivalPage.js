import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Container,
  Grid,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import axios from 'axios';

const FestivalsPage = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'EmriFestivalit', direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/festivals');
      setFestivals(response.data);
    } catch (error) {
      console.error('Error fetching festivals:', error);
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false);
    }
  };

  const handleAddFestival = () => {
    navigate('/festivals/new');
  };

  const handleViewFestival = (id) => {
    navigate(`/festivals/${id}`);
  };

  const handleEditFestival = (id, e) => {
    e.stopPropagation();
    navigate(`/festivals/${id}/edit`);
  };

  const handleDeleteFestival = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this festival?')) {
      try {
        await axios.delete(`http://localhost:5000/api/festivals/${id}`);
        fetchFestivals();
      } catch (error) {
        console.error('Error deleting festival:', error);
        // Handle error (e.g., show error message)
      }
    }
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatus = (startDate, endDate) => {
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

  const filteredFestivals = festivals
    .filter(festival => {
      const matchesSearch = festival.EmriFestivalit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        festival.LlojiFestivalit.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterType === 'all') return matchesSearch;
      const status = getStatus(festival.startDate, festival.endDate);
      return status === filterType && matchesSearch;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading festivals...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Festivals
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddFestival}
          >
            Add Festival
          </Button>
        </Box>

        <Paper sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search festivals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Festivals</MenuItem>
                  <MenuItem value="Upcoming">Upcoming</MenuItem>
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'EmriFestivalit'}
                    direction={sortConfig.key === 'EmriFestivalit' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('EmriFestivalit')}
                  >
                    Festival Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'LlojiFestivalit'}
                    direction={sortConfig.key === 'LlojiFestivalit' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('LlojiFestivalit')}
                  >
                    Festival Type
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFestivals
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((festival) => (
                  <TableRow 
                    key={festival.ID}
                    hover
                    onClick={() => handleViewFestival(festival.ID)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{festival.EmriFestivalit}</TableCell>
                    <TableCell>{festival.LlojiFestivalit}</TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={(e) => handleEditFestival(festival.ID, e)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={(e) => handleDeleteFestival(festival.ID, e)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredFestivals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography variant="subtitle1" color="textSecondary">
                      No festivals found. Try adjusting your search or filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredFestivals.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Container>
  );
};

export default FestivalsPage;
