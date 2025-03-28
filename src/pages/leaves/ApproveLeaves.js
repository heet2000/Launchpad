import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Container,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
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
    Paper,
    IconButton,
    Tooltip
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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    background: 'rgba(20, 20, 30, 0.8)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: '20px',
    maxHeight: '600px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(158, 0, 255, 0.5)',
        borderRadius: '4px',
        '&:hover': {
            background: 'rgba(158, 0, 255, 0.7)',
        }
    },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    '& .MuiTableCell-head': {
        backgroundColor: 'rgba(0, 0, 0, 1)',
        color: 'var(--primary-color)',
        fontWeight: 600,
        fontSize: '1rem',
        padding: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    transition: 'all 0.3s ease',
    '&:nth-of-type(odd)': {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    '&:hover': {
        backgroundColor: 'rgba(158, 0, 255, 0.1)',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: 'rgba(255, 255, 255, 0.9)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '12px 16px',
    fontSize: '0.9rem',
}));

const ActionButton = styled(IconButton)(({ theme, color }) => ({
    backgroundColor: color === 'approve'
        ? 'rgba(76, 175, 80, 0.1)'
        : 'rgba(244, 67, 54, 0.1)',
    margin: '0 4px',
    padding: '8px',
    '&:hover': {
        backgroundColor: color === 'approve'
            ? 'rgba(76, 175, 80, 0.2)'
            : 'rgba(244, 67, 54, 0.2)',
        transform: 'scale(1.1)',
    },
    '& svg': {
        color: color === 'approve' ? '#4caf50' : '#f44336',
        fontSize: '1.1rem',
    }
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
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [employeeList, setEmployeeList] = useState([]);
    const userData = localStorage.getItem('user');
    const user = JSON.parse(userData);
    const empId = user.empId;

    // Load employee data
    useEffect(() => {
        const loadEmployeeData = () => {
            try {
                const allEmployeeData = localStorage.getItem('allEmployees');
                if (allEmployeeData) {
                    const parsedData = JSON.parse(allEmployeeData);
                    setEmployeeList(Array.isArray(parsedData) ? parsedData : []);
                    console.log("Loaded employee data:", parsedData);
                } else {
                    console.log("No employee data found in localStorage");
                    // If employee data is not available, fetch it
                    fetchEmployeeData();
                }
            } catch (error) {
                console.error("Error loading employee data:", error);
                setEmployeeList([]);
            }
        };

        loadEmployeeData();
    }, []);

    // Function to fetch employee data if not available in localStorage
    const fetchEmployeeData = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.post('https://emploeeservice.onrender.com/employees', {}, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.status === 200 && response.data) {
                localStorage.setItem('allEmployees', JSON.stringify(response.data));
                setEmployeeList(response.data);
                console.log("Fetched employee data:", response.data);
            }
        } catch (error) {
            console.error('Failed to fetch employees data:', error);
        }
    };

    const fetchLeaveRequests = useCallback(async () => {
        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');

            // Build the API URL with filters
            let url = `https://emploeeservice.onrender.com/employees/${currentUser.empId}/requests?type=approval`;

            const response = await axios.post(url, {}, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                console.log("Fetched leave requests:", response.data);
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
    }, [currentUser]);

    // Fetch leave requests on component mount
    useEffect(() => {
        fetchLeaveRequests();
    }, [fetchLeaveRequests]);

    // Fetch leave requests when filters change
    useEffect(() => {
        fetchLeaveRequests();
    }, [filterType, fetchLeaveRequests]);

    const handleStatusChange = async (leaveId, status) => {
        if (!currentUser) {
            setMessage("You don't have permission to perform this action");
            setMessageType('error');
            setOpenSnackbar(true);
            return;
        }

        // Set processing state for this leave
        setProcessing(prev => ({ ...prev, [leaveId]: true }));

        try {
            const authToken = localStorage.getItem('authToken');

            const response = await axios.put(
                `https://emploeeservice.onrender.com/request-approvals/${leaveId}`,
                {
                    requestStatus: status,
                    userId: empId,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(response);

            if (response.status === 200) {
                setMessage(`Leave request ${status.toLowerCase()} successfully`);
                setMessageType('success');
                setOpenSnackbar(true);

                // Fetch updated leave requests instead of removing from the list
                fetchLeaveRequests();
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

    const employeeName = useMemo(() =>
        employeeList.map(employee => {
            return {
                empId: employee.id || employee.empId,
                employeeName: employee?.name
            }
        }),
        [employeeList]);

    console.log("Mapped Employee Names:", employeeName);

    // Updated filter function to include status filtering
    const filteredLeaveRequests = React.useMemo(() => {
        if (!leaveRequests || !Array.isArray(leaveRequests)) return [];

        console.log("Original Leave Requests:", leaveRequests);
        console.log("Current Employee List:", employeeList);

        return leaveRequests.filter(leave => {
            // Filter by type if filter is not set to ALL
            if (filterType !== 'ALL' && leave.requestType !== filterType) {
                return false;
            }

            // Filter by status if filter is not set to ALL
            const leaveStatus = leave?.status || leave?.requestStatus;
            if (filterStatus !== 'ALL' && leaveStatus !== filterStatus) {
                return false;
            }

            return true;
        }).map(leave => {
            // Find the employee name from the employee list
            const matchingEmployee = employeeList.find(emp => {
                // Ensure both values are strings for comparison
                const empIdentifier = String(emp.id || emp.empId || '');
                const leaveRequester = String(leave.requesterEmpId || '');

                // Check if there's a match using loose equality (handles string/number differences)
                const isMatch = empIdentifier === leaveRequester;

                if (isMatch) {
                    console.log(`Found match for ${leaveRequester}:`, emp);
                }

                return isMatch;
            });

            console.log(`Processing leave ${leave.id || ''}:`, {
                requesterEmpId: leave.requesterEmpId,
                foundEmployee: matchingEmployee ? true : false,
                foundName: matchingEmployee?.name,
                assignedName: matchingEmployee?.name || 'Unknown'
            });

            return {
                ...leave,
                requestName: matchingEmployee?.name || 'Unknown'
            };
        });
    }, [leaveRequests, filterType, filterStatus, employeeList]);

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
                                <Grid item xs={12} md={4}>
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

                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Status</InputLabel>
                                        <StyledSelect
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            label="Status"
                                        >
                                            <MenuItem value="ALL">All Statuses</MenuItem>
                                            <MenuItem value="PENDING">Pending</MenuItem>
                                            <MenuItem value="APPROVED">Approved</MenuItem>
                                            <MenuItem value="REJECTED">Rejected</MenuItem>
                                        </StyledSelect>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </FilterSection>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : filteredLeaveRequests.length > 0 ? (
                            <StyledTableContainer component={Paper}>
                                <Table stickyHeader aria-label="leave requests table">
                                    <StyledTableHead>
                                        <TableRow>
                                            <StyledTableCell>Employee</StyledTableCell>
                                            <StyledTableCell>Request Type</StyledTableCell>
                                            <StyledTableCell>Start Date</StyledTableCell>
                                            <StyledTableCell>End Date</StyledTableCell>
                                            <StyledTableCell>Status</StyledTableCell>
                                            <StyledTableCell align="right">Actions</StyledTableCell>
                                        </TableRow>
                                    </StyledTableHead>
                                    <TableBody>
                                        {filteredLeaveRequests.map((leave) => (
                                            <StyledTableRow key={leave.id || leave._id}>
                                                <StyledTableCell>
                                                    <Typography sx={{ fontWeight: 600 }}>
                                                        {leave.requestName || "Unknown"}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                        Employee ID: {leave.requesterEmpId || ""}
                                                    </Typography>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <Typography
                                                        sx={{
                                                            color: leave.requestType === 'LEAVE' ? '#ff9800' : '#2196f3',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        {leave.requestType || leave.leaveType}
                                                    </Typography>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {new Date(leave.startDate || leave.fromDate).toLocaleDateString()}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {new Date(leave.endDate || leave.toDate).toLocaleDateString()}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <LeaveChip
                                                        label={leave?.status || leave?.requestStatus}
                                                        status={leave?.status || leave?.requestStatus}
                                                        size="small"
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {leave?.requestStatus === "PENDING" && (
                                                        <>
                                                            <Tooltip title="Approve">
                                                                <ActionButton
                                                                    color="approve"
                                                                    onClick={() => handleStatusChange(leave.id, 'APPROVED')}
                                                                    disabled={processing[leave.id || leave._id]}
                                                                >
                                                                    <FaCheck />
                                                                </ActionButton>
                                                            </Tooltip>
                                                            <Tooltip title="Decline">
                                                                <ActionButton
                                                                    color="decline"
                                                                    onClick={() => handleStatusChange(leave.id || leave._id, 'REJECTED')}
                                                                    disabled={processing[leave.id]}
                                                                >
                                                                    <FaTimes />
                                                                </ActionButton>
                                                            </Tooltip>
                                                        </>
                                                    )
                                                    }
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