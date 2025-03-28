import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    CircularProgress
} from '@mui/material';

const AdminDashboardContent = styled.div`
  width: 100%;
`;

const Logo = styled.div`
  color: var(--primary-color);
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--light-color);
  font-size: 16px;
`;

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5
        }
    }
};

const StatusChip = ({ status }) => {
    let color = 'default';

    switch (status) {
        case 'APPROVED':
            color = 'success';
            break;
        case 'REJECTED':
            color = 'error';
            break;
        case 'PENDING':
            color = 'warning';
            break;
        default:
            color = 'default';
    }

    return <Chip label={status} color={color} size="small" />;
};

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filterEmployee, setFilterEmployee] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get employees from localStorage
    const employees = useMemo(() => {
        try {
            const employeesData = localStorage.getItem('allEmployees');
            return employeesData ? JSON.parse(employeesData) : [];
        } catch (error) {
            console.error('Error parsing employees data:', error);
            return [];
        }
    }, []);

    // Fetch leave requests
    const fetchLeaveRequests = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await axios.post('https://emploeeservice.onrender.com/get-all-request', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.data) {
                console.log('Leave requests data:', response.data);
                setLeaveRequests(response.data);
            }
        } catch (error) {
            console.error('Error fetching leave requests:', error);
            setError('Failed to load leave requests. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    // Filter leave requests based on selected filters
    const filteredLeaveRequests = useMemo(() => {
        if (!leaveRequests || !Array.isArray(leaveRequests)) return [];

        return leaveRequests.filter(leave => {
            // Filter by employee if filter is not set to ALL
            if (filterEmployee !== 'ALL' && leave.requesterEmpId !== filterEmployee) {
                return false;
            }

            // Filter by status if filter is not set to ALL
            if (filterStatus !== 'ALL' && leave.requestStatus !== filterStatus) {
                return false;
            }

            return true;
        }).map(leave => {
            // Find employee details
            const employee = employees.find(emp =>
                String(emp.id) === String(leave.requesterEmpId) ||
                String(emp.empId) === String(leave.requesterEmpId)
            );

            return {
                ...leave,
                requestName: employee?.name || 'Unknown'
            };
        });
    }, [leaveRequests, filterEmployee, filterStatus, employees]);

    // Only render admin dashboard for admin users
    if (currentUser && currentUser.email !== 'admin@payoda.com') {
        return (
            <DashboardLayout>
                <AdminDashboardContent>
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color: 'var(--error-color)' }}>
                            Access Denied
                        </Typography>
                        <Typography sx={{ mt: 2, color: 'var(--light-color)' }}>
                            You don't have permission to access the admin dashboard.
                        </Typography>
                    </Box>
                </AdminDashboardContent>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <AdminDashboardContent>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Logo>Admin Dashboard</Logo>

                    <motion.div variants={itemVariants}>
                        <FilterContainer>
                            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                                <InputLabel id="employee-filter-label" sx={{ color: 'var(--light-color)' }}>
                                    Employee
                                </InputLabel>
                                <Select
                                    labelId="employee-filter-label"
                                    value={filterEmployee}
                                    onChange={(e) => setFilterEmployee(e.target.value)}
                                    label="Employee"
                                    sx={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                        color: 'var(--light-color)',
                                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(157, 0, 255, 0.3)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary-color)' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary-color)' }
                                    }}
                                >
                                    <MenuItem value="ALL">All Employees</MenuItem>
                                    {employees.map((employee) => (
                                        <MenuItem key={employee.id || employee.empId} value={employee.id}>
                                            {employee.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                                <InputLabel id="status-filter-label" sx={{ color: 'var(--light-color)' }}>
                                    Status
                                </InputLabel>
                                <Select
                                    labelId="status-filter-label"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    label="Status"
                                    sx={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                        color: 'var(--light-color)',
                                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(157, 0, 255, 0.3)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary-color)' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary-color)' }
                                    }}
                                >
                                    <MenuItem value="ALL">All Statuses</MenuItem>
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                    <MenuItem value="APPROVED">Approved</MenuItem>
                                    <MenuItem value="REJECTED">Rejected</MenuItem>
                                </Select>
                            </FormControl>
                        </FilterContainer>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Box
                            className="glass-panel"
                            sx={{
                                borderRadius: '12px',
                                overflow: 'hidden'
                            }}
                        >
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress sx={{ color: 'var(--primary-color)' }} />
                                </Box>
                            ) : error ? (
                                <Box sx={{ p: 3, textAlign: 'center', color: 'var(--error-color)' }}>
                                    {error}
                                </Box>
                            ) : (
                                <TableContainer component={Paper} sx={{
                                    maxHeight: 'calc(100vh - 240px)',
                                    backgroundColor: 'transparent',
                                    boxShadow: 'none'
                                }}>
                                    <Table stickyHeader sx={{
                                        minWidth: 650,
                                        '& .MuiTableCell-root': {
                                            backgroundColor: 'rgba(0, 0, 0, 1)',
                                            color: 'var(--light-color)'
                                        },
                                        '& .MuiTableCell-head': {
                                            backgroundColor: 'rgba(0, 0, 0, 1)',
                                            fontWeight: 'bold',
                                            color: 'var(--primary-color)'
                                        }
                                    }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Employee</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Start Date</TableCell>
                                                <TableCell>End Date</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredLeaveRequests.length > 0 ? (
                                                filteredLeaveRequests.map((leave) => (
                                                    <TableRow key={leave.id} sx={{ '&:hover': { backgroundColor: 'rgba(157, 0, 255, 0.1)' } }}>
                                                        <TableCell>
                                                            <Typography sx={{ fontWeight: 600 }}>
                                                                {leave.requestName}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                                Employee ID: {leave.requesterEmpId}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>{leave.requestType}</TableCell>
                                                        <TableCell>
                                                            {leave.fromDate}
                                                        </TableCell>
                                                        <TableCell>
                                                            {leave.toDate}
                                                        </TableCell>

                                                        <TableCell>
                                                            <StatusChip status={leave.requestStatus} />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7}>
                                                        <NoDataMessage>
                                                            No leave requests found matching the selected filters.
                                                        </NoDataMessage>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>
                    </motion.div>
                </motion.div>
            </AdminDashboardContent>
        </DashboardLayout>
    );
};

export default AdminDashboard; 