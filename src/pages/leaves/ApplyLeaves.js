import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
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
    color: '#ffffff',
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
    color: '#ffffff',
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

const StyledSelect = styled(Select)(({ theme }) => ({
    marginBottom: '20px',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '& .MuiSelect-select': {
        color: '#ffffff',
    },
    '& .MuiSvgIcon-root': {
        color: 'rgba(255, 255, 255, 0.8)',
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
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
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
    color: '#ffffff',
    marginBottom: '15px',
    fontWeight: 600,
    fontSize: '1.2rem',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    background: 'rgba(20, 20, 30, 0.8)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: '20px',
    maxHeight: '400px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(76, 175, 80, 0.5)',
        borderRadius: '4px',
        '&:hover': {
            background: 'rgba(76, 175, 80, 0.7)',
        }
    },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    '& .MuiTableCell-head': {
        backgroundColor: 'rgba(0, 0, 0, 0.93)',
        color: '#ffffff',
        fontWeight: 600,
        fontSize: '1rem',
        padding: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10000,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    transition: 'all 0.3s ease',
    '&:nth-of-type(odd)': {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    '&:hover': {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: '#ffffff',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '12px 16px',
    fontSize: '0.9rem',
}));

const ApplyLeaves = () => {
    const { currentUser } = useAuth();
    const [leaveType, setLeaveType] = useState('LEAVE');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs().add(1, 'day'));
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [filterType, setFilterType] = useState('ALL');

    const fetchLeaves = useCallback(async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');

            // Build the API URL with filters
            let url = `https://emploeeservice.onrender.com/employees/${currentUser.empId}/requests?type=created`;

            const response = await axios.post(url, {}, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201 || response.status === 202) {
                // Transform the response data into the format we need
                console.log(response.data);
                setLoading(false);

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
    }, [currentUser]);

    // Fetch leaves data on component mount
    useEffect(() => {
        fetchLeaves();
    }, [fetchLeaves]);

    // Fetch leaves when filters change
    useEffect(() => {
        fetchLeaves();
    }, [filterType, fetchLeaves]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            setMessage('You must be logged in to apply for leave');
            setMessageType('error');
            setOpenSnackbar(true);
            return;
        }

        if (!leaveType || !startDate || !endDate) {
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
                requestType: leaveType,
                fromDate: startDate.format('YYYY-MM-DD'),
                toDate: endDate.format('YYYY-MM-DD'),
            };

            const response = await axios.post(
                'https://emploeeservice.onrender.com/request-approvals',
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

    const filteredLeaves = React.useMemo(() => {
        if (!leaves || !Array.isArray(leaves)) return [];

        return leaves.filter(leave => {
            // Filter by type if filter is not set to ALL
            if (filterType !== 'ALL' && leave.requestType !== filterType) {
                return false;
            }

            return true;
        });
    }, [leaves, filterType]);

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
                                            <InputLabel sx={{ color: '#ffffff' }}>Leave Type</InputLabel>
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
                                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                                    },
                                                    '& input': {
                                                        color: '#ffffff'
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#ffffff'
                                                    },
                                                    '& .MuiInputAdornment-root': {
                                                        color: 'rgba(255, 255, 255, 0.8)'
                                                    },
                                                },
                                                '& .MuiFormLabel-root': {
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                }
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
                                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                                    },
                                                    '& input': {
                                                        color: '#ffffff',
                                                        borderColor: '#ffffff'
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#ffffff'
                                                    },
                                                    '& .MuiInputAdornment-root': {
                                                        color: 'rgba(255, 255, 255, 0.8)'
                                                    },
                                                },
                                                '& .MuiFormLabel-root': {
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                }
                                            }}
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
                                                <InputLabel sx={{ color: '#ffffff' }}>Type</InputLabel>
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
                                    </Grid>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                        <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                                            {!loading && (
                                                <>{filteredLeaves.length} {filteredLeaves.length === 1 ? 'application' : 'applications'} found</>
                                            )}
                                        </Typography>
                                    </Box>
                                </FilterSection>

                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : filteredLeaves.length > 0 ? (
                                    <StyledTableContainer component={Paper}>
                                        <Table stickyHeader aria-label="leave applications table">
                                            <StyledTableHead>
                                                <TableRow>
                                                    <StyledTableCell>Start Date</StyledTableCell>
                                                    <StyledTableCell>End Date</StyledTableCell>
                                                    <StyledTableCell>Request Type</StyledTableCell>
                                                    <StyledTableCell align="right">Status</StyledTableCell>
                                                </TableRow>
                                            </StyledTableHead>
                                            <TableBody>
                                                {filteredLeaves.map((leave) => (
                                                    <StyledTableRow key={leave.id || leave._id}>
                                                        <StyledTableCell>
                                                            {new Date(leave.fromDate).toLocaleDateString()}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {new Date(leave.toDate).toLocaleDateString()}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <Typography
                                                                sx={{
                                                                    color: leave.requestType === 'LEAVE' ? '#ff9800' : '#2196f3',
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                {leave.requestType}
                                                            </Typography>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right">
                                                            <LeaveChip
                                                                label={leave?.requestStatus}
                                                                status={leave?.requestStatus}
                                                                size="small"
                                                            />
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </StyledTableContainer>
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