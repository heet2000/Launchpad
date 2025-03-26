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
    Alert,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaCheck, FaTimes } from 'react-icons/fa';
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
    padding: '20px',
    marginBottom: '25px',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
    }
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

const ApproveButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
    color: '#fff',
    fontWeight: 600,
    padding: '8px 16px',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 10px rgba(46, 125, 50, 0.3)',
    },
    '&.Mui-disabled': {
        background: 'rgba(76, 175, 80, 0.1)',
        color: 'rgba(76, 175, 80, 0.3)',
    }
}));

const DeclineButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #f44336 0%, #c62828 100%)',
    color: '#fff',
    fontWeight: 600,
    padding: '8px 16px',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    marginLeft: '10px',
    '&:hover': {
        background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 10px rgba(244, 67, 54, 0.3)',
    },
    '&.Mui-disabled': {
        background: 'rgba(244, 67, 54, 0.1)',
        color: 'rgba(244, 67, 54, 0.3)',
    }
}));

const EmployeeInfo = styled(Box)(({ theme }) => ({
    background: 'rgba(0, 0, 0, 0.2)',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '15px',
}));

const ApproveLeaves = () => {
    const { currentUser } = useAuth();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState({});
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [filterType, setFilterType] = useState('ALL');
    const [filterLocation, setFilterLocation] = useState('');

    const fetchLeaveRequests = useCallback(async () => {
        if (!currentUser || currentUser.email !== "admin@payoda.com") {
            setMessage("You don't have permission to access this page");
            setMessageType('error');
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');

            // Build the API URL with filters
            let url = 'https://f767-2401-4900-1cb2-8c47-8516-9f7e-5b84-e7e8.ngrok-free.app/leaves/all';

            // Add query parameters for filters if they're set
            const params = new URLSearchParams();

            if (filterType !== 'ALL') {
                params.append('type', filterType);
            }

            if (filterLocation && filterLocation.trim() !== '') {
                params.append('location', filterLocation.trim());
            }

            // Add status=PENDING to only show pending requests
            params.append('status', 'PENDING');

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
                setLeaveRequests(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching leave requests:', error);
            setMessage('Failed to fetch leave requests');
            setMessageType('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    }, [currentUser, filterType, filterLocation]);

    // Fetch leave requests on component mount
    useEffect(() => {
        fetchLeaveRequests();
    }, [fetchLeaveRequests]);

    // Fetch leave requests when filters change
    useEffect(() => {
        fetchLeaveRequests();
    }, [filterType, filterLocation, fetchLeaveRequests]);

    const handleStatusChange = async (leaveId, status) => {
        if (!currentUser || currentUser.email !== "admin@payoda.com") {
            setMessage("You don't have permission to perform this action");
            setMessageType('error');
            setOpenSnackbar(true);
            return;
        }

        // Set processing state for this leave ID
        setProcessing(prev => ({ ...prev, [leaveId]: true }));

        try {
            const authToken = localStorage.getItem('authToken');

            const response = await axios.put(
                `https://f767-2401-4900-1cb2-8c47-8516-9f7e-5b84-e7e8.ngrok-free.app/leaves/${leaveId}`,
                { status },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setMessage(`Leave request ${status.toLowerCase()}`);
                setMessageType('success');
                setOpenSnackbar(true);

                // Remove the processed request from the list or update its status
                setLeaveRequests(prev => prev.filter(leave => leave.id !== leaveId));
            }
        } catch (error) {
            console.error(`Error ${status.toLowerCase()} leave request:`, error);
            setMessage(`Failed to ${status.toLowerCase()} leave request`);
            setMessageType('error');
            setOpenSnackbar(true);
        } finally {
            // Clear processing state for this leave ID
            setProcessing(prev => ({ ...prev, [leaveId]: false }));
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const resetFilters = () => {
        setFilterType('ALL');
        setFilterLocation('');
        // Fetch leave requests with reset filters
        fetchLeaveRequests();
    };

    return (
        <PageContainer>
            <Sidebar />
            <ContentContainer>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <PageTitle variant="h4">Approve Leave Requests</PageTitle>

                        <FilterSection>
                            <FilterTitle variant="h6">Filter Leave Requests</FilterTitle>
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
                                        <>{leaveRequests.length} pending {leaveRequests.length === 1 ? 'request' : 'requests'} found</>
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
                                        onClick={fetchLeaveRequests}
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
                                                boxShadow: '0 6px 14px rgba(0, 0, 0, 0.2)',
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
                        ) : leaveRequests.length > 0 ? (
                            <Grid container spacing={3}>
                                {leaveRequests.map((leave) => (
                                    <Grid item xs={12} md={6} lg={4} key={leave.id}>
                                        <StyledCard>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6" sx={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                                                    {leave.leaveType} Request
                                                </Typography>
                                                <LeaveChip
                                                    label={leave.status}
                                                    status={leave.status}
                                                    size="small"
                                                />
                                            </Box>

                                            <EmployeeInfo>
                                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                                                    Employee:
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                                                    {leave.employeeName || 'Unknown'} (ID: {leave.empId})
                                                </Typography>
                                            </EmployeeInfo>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                                                        Location:
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {leave.location}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12}>
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
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            color: 'rgba(255, 255, 255, 0.9)',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                        }}
                                                    >
                                                        {leave.reason}
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <ApproveButton
                                                    startIcon={<FaCheck />}
                                                    onClick={() => handleStatusChange(leave.id, 'APPROVED')}
                                                    disabled={processing[leave.id]}
                                                    fullWidth
                                                    sx={{ mr: 1 }}
                                                >
                                                    {processing[leave.id] ? 'Processing...' : 'Approve'}
                                                </ApproveButton>

                                                <DeclineButton
                                                    startIcon={<FaTimes />}
                                                    onClick={() => handleStatusChange(leave.id, 'DECLINED')}
                                                    disabled={processing[leave.id]}
                                                    fullWidth
                                                    sx={{ ml: 1 }}
                                                >
                                                    {processing[leave.id] ? 'Processing...' : 'Decline'}
                                                </DeclineButton>
                                            </Box>
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
                                    No pending leave requests found
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}>
                                    All leave requests have been processed or no requests match your filter criteria
                                </Typography>
                            </Box>
                        )}
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
            </ContentContainer>
        </PageContainer>
    );
};

export default ApproveLeaves; 