import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Grid,
    Card,
    Chip,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

const PageContainer = styled(Box)`
  display: flex;
  min-height: 100vh;
`;

const ContentContainer = styled(Box)`
  flex-grow: 1;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const PageTitle = styled(Typography)(({ theme }) => ({
    color: 'var(--primary-color)',
    marginBottom: '30px',
    fontWeight: 600,
    fontSize: '1.8rem',
    textAlign: 'center',
    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
}));

const StyledCard = styled(Card)(({ theme }) => ({
    background: 'rgba(20, 20, 30, 0.8)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '15px',
    marginBottom: '25px',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
    }
}));

const CardTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.2rem',
    fontWeight: 600,
    color: 'var(--primary-color)',
    marginBottom: '10px'
}));

const LeaveChip = styled(Chip)(({ theme, status }) => ({
    backgroundColor: status === 'APPROVED'
        ? 'rgba(76, 175, 80, 0.15)'
        : status === 'PENDING'
            ? 'rgba(255, 152, 0, 0.15)'
            : 'rgba(244, 67, 54, 0.15)',
    color: status === 'APPROVED'
        ? '#4caf50'
        : status === 'PENDING'
            ? '#ff9800'
            : '#f44336',
    fontWeight: 600,
    marginLeft: 'auto'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: '20px',
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.4)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--primary-color)',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.6)',
    },
    '& .MuiInputBase-input': {
        color: 'rgba(255, 255, 255, 0.9)',
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    marginBottom: '20px',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--primary-color)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    '& .MuiSelect-select': {
        color: 'rgba(255, 255, 255, 0.9)',
    },
    '& .MuiSvgIcon-root': {
        color: 'rgba(255, 255, 255, 0.6)',
    },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
    color: '#fff',
    fontWeight: 600,
    padding: '10px 20px',
    borderRadius: '8px',
    marginTop: '15px',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 100%)',
        transform: 'translateY(-3px)',
        boxShadow: '0 7px 14px rgba(0, 0, 0, 0.2)',
    },
    '&.Mui-disabled': {
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.3)',
    }
}));

const FilterSection = styled(Box)(({ theme }) => ({
    padding: '20px',
    background: 'rgba(30, 30, 40, 0.6)',
    borderRadius: '10px',
    marginBottom: '30px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const FilterTitle = styled(Typography)(({ theme }) => ({
    color: 'var(--primary-color)',
    marginBottom: '15px',
    fontWeight: 600,
    fontSize: '1.2rem',
}));

const ApplyLeaves = () => {
    const { currentUser } = useAuth();
    const [leaveType, setLeaveType] = useState('LEAVE');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs().add(1, 'day'));
    const [reason, setReason] = useState('');
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [filterType, setFilterType] = useState('ALL');
    const [filterLocation, setFilterLocation] = useState('');

    const fetchLeaves = useCallback(async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');

            // Build the API URL with filters
            let url = `https://f767-2401-4900-1cb2-8c47-8516-9f7e-5b84-e7e8.ngrok-free.app/leaves/${currentUser.empId}`;

            // Add query parameters for filters if they're set
            const params = new URLSearchParams();
            if (filterType !== 'ALL') {
                params.append('type', filterType);
            }
            if (filterLocation) {
                params.append('location', filterLocation);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                // Transform the response data into the format we need
                setLeaves(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
            setMessage('Failed to fetch leave data');
            setMessageType('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    }, [currentUser, filterType, filterLocation]);

    // Fetch leaves data on component mount
    useEffect(() => {
        fetchLeaves();
    }, [fetchLeaves]);

    // Fetch leaves when filters change
    useEffect(() => {
        fetchLeaves();
    }, [filterType, filterLocation, fetchLeaves]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            setMessage('You must be logged in to apply for leave');
            setMessageType('error');
            setOpenSnackbar(true);
            return;
        }

        if (!leaveType || !reason) {
            setMessage('Please fill in all required fields');
            setMessageType('error');
            setOpenSnackbar(true);
            return;
        }

        setSubmitting(true);

        try {
            const authToken = localStorage.getItem('authToken');

            const leaveData = {
                empId: currentUser.empId,
                leaveType,
                location: "N/A",
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD'),
                reason
            };

            const response = await axios.post(
                'https://f767-2401-4900-1cb2-8c47-8516-9f7e-5b84-e7e8.ngrok-free.app/leaves',
                leaveData,
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201 || response.status === 200) {
                setMessage('Leave application submitted successfully');
                setMessageType('success');
                setOpenSnackbar(true);

                // Reset form fields
                setLeaveType('LEAVE');
                setStartDate(dayjs());
                setEndDate(dayjs().add(1, 'day'));
                setReason('');

                // Refresh the leaves list
                fetchLeaves();
            }
        } catch (error) {
            console.error('Error applying for leave:', error);
            setMessage(error.response?.data?.message || 'Failed to submit leave application');
            setMessageType('error');
            setOpenSnackbar(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const resetFilters = () => {
        setFilterType('ALL');
        setFilterLocation('');
        // Fetch leaves with reset filters
        fetchLeaves();
    };

    return (
        <PageContainer>
            <Sidebar />
            <ContentContainer>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Container maxWidth="lg" sx={{ py: 4 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <PageTitle variant="h4">Apply for Leave</PageTitle>

                            <StyledCard component="form" onSubmit={handleSubmit}>
                                <CardTitle variant="h5">Leave Application Form</CardTitle>

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Leave Type</InputLabel>
                                            <StyledSelect
                                                value={leaveType}
                                                onChange={(e) => setLeaveType(e.target.value)}
                                                label="Leave Type"
                                                required
                                            >
                                                <MenuItem value="LEAVE">Leave</MenuItem>
                                                <MenuItem value="WFH">Work From Home</MenuItem>
                                            </StyledSelect>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <DatePicker
                                            label="Start Date"
                                            value={startDate}
                                            onChange={(newValue) => setStartDate(newValue)}
                                            sx={{
                                                width: '100%',
                                                mb: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <DatePicker
                                            label="End Date"
                                            value={endDate}
                                            onChange={(newValue) => setEndDate(newValue)}
                                            minDate={startDate}
                                            sx={{
                                                width: '100%',
                                                mb: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <StyledTextField
                                            label="Reason"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            required
                                            placeholder="Enter the reason for your leave"
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <SubmitButton
                                        type="submit"
                                        variant="contained"
                                        disabled={submitting}
                                        startIcon={submitting && <CircularProgress size={20} color="inherit" />}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Leave Request'}
                                    </SubmitButton>
                                </Box>
                            </StyledCard>

                            <Box mt={6}>
                                <CardTitle variant="h5">My Leave Applications</CardTitle>

                                <FilterSection>
                                    <FilterTitle variant="h6">Filter Leave Applications</FilterTitle>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Type</InputLabel>
                                                <StyledSelect
                                                    value={filterType}
                                                    onChange={(e) => setFilterType(e.target.value)}
                                                    label="Type"
                                                >
                                                    <MenuItem value="ALL">All Types</MenuItem>
                                                    <MenuItem value="LEAVE">Leave</MenuItem>
                                                    <MenuItem value="WFH">Work From Home</MenuItem>
                                                </StyledSelect>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <StyledTextField
                                                label="Location"
                                                fullWidth
                                                value={filterLocation}
                                                onChange={(e) => setFilterLocation(e.target.value)}
                                                placeholder="Filter by location"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                        <Typography variant="body1" sx={{ color: 'var(--primary-color)', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                                            {!loading && (
                                                <>{leaves.length} {leaves.length === 1 ? 'application' : 'applications'} found</>
                                            )}
                                        </Typography>
                                        <Box>
                                            <Button
                                                variant="outlined"
                                                onClick={resetFilters}
                                                sx={{
                                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'rgba(255, 255, 255, 0.8)',
                                                    mr: 2,
                                                    '&:hover': {
                                                        borderColor: 'var(--primary-color)',
                                                        background: 'rgba(157, 0, 255, 0.1)',
                                                    }
                                                }}
                                            >
                                                Clear Filters
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={fetchLeaves}
                                                sx={{
                                                    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 100%)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 7px 14px rgba(0, 0, 0, 0.2)',
                                                    }
                                                }}
                                            >
                                                Apply Filters
                                            </Button>
                                        </Box>
                                    </Box>
                                </FilterSection>

                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : leaves.length > 0 ? (
                                    <Grid container spacing={3}>
                                        {leaves.map((leave) => (
                                            <Grid item xs={12} key={leave.id}>
                                                <StyledCard>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <Typography variant="h6" sx={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                                                            {leave.leaveType}
                                                        </Typography>
                                                        <LeaveChip
                                                            label={leave.status}
                                                            status={leave.status}
                                                            size="small"
                                                        />
                                                    </Box>

                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                                                                Location:
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                                {leave.location}
                                                            </Typography>
                                                        </Grid>

                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                                                                Dates:
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                                {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                                                            </Typography>
                                                        </Grid>

                                                        <Grid item xs={12}>
                                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                                                                Reason:
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                                {leave.reason}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </StyledCard>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Box sx={{
                                        textAlign: 'center',
                                        py: 4,
                                        background: 'rgba(30, 30, 40, 0.4)',
                                        borderRadius: '10px'
                                    }}>
                                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            No leave applications found
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}>
                                            Use the form above to submit a new leave request
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </motion.div>

                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={6000}
                            onClose={handleCloseSnackbar}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                            <Alert onClose={handleCloseSnackbar} severity={messageType} sx={{ width: '100%' }}>
                                {message}
                            </Alert>
                        </Snackbar>
                    </Container>
                </LocalizationProvider>
            </ContentContainer>
        </PageContainer>
    );
};

export default ApplyLeaves; 