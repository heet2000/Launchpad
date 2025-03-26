import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { Box, Grid } from '@mui/material';
import Calender from '../charts/calendar';
import GaugeChart from '../charts/gauge-chart';
import LineChart from '../charts/line-chart';

const DashboardContent = styled.div`
  width: 100%;
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

const Logo = styled.div`
  color: var(--primary-color);
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
`;

const Dashboard = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [isTablet, setIsTablet] = useState(window.innerWidth > 600 && window.innerWidth <= 960);
    const [leaveData, setLeaveData] = useState({});
    console.log(leaveData, "leaveData");

    const monthwiseLeave = useMemo(() => {
        if (leaveData?.monthly_leaves) {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(monthNo => (leaveData?.monthly_leaves[monthNo] || 0));
        }
        return [];
    }, [leaveData]);

    // Add event listener for responsive design
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
            setIsTablet(window.innerWidth > 600 && window.innerWidth <= 960);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <DashboardLayout>
            <DashboardContent>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                        padding: isMobile ? '4px' : isTablet ? '6px' : '8px',
                        width: '100%',
                        height: 'calc(100vh - 16px)',
                        boxSizing: 'border-box',
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >

                    <Logo>
                        Dashboard
                    </Logo>

                    <Grid
                        container
                        spacing={1}
                        sx={{
                            flexGrow: 1,
                            width: '100%',
                            margin: 0,
                            height: 'calc(100% - 50px)'
                        }}
                    >
                        <Grid item xs={12} md={6} sx={{ height: { xs: '30%', md: '48%' }, padding: '2px' }}>
                            <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                <Box
                                    className="glass-panel"
                                    sx={{
                                        borderRadius: '12px',
                                        padding: '6px',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 16px rgba(106, 17, 203, 0.4)'
                                        }
                                    }}
                                >

                                    <Logo>
                                        Attendance
                                    </Logo>
                                    <Box sx={{
                                        flex: 1,
                                        minHeight: 0,
                                        width: '100%',
                                        height: 'calc(100% - 24px)',
                                        overflow: 'hidden',
                                        '& > *': {
                                            width: '100% !important',
                                            height: '100% !important'
                                        }
                                    }}>
                                        <Calender setLeaveData={setLeaveData} />
                                    </Box>
                                </Box>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ height: { xs: '30%', md: '48%' }, padding: '2px' }}>
                            <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                <Box
                                    className="glass-panel"
                                    sx={{
                                        borderRadius: '12px',
                                        padding: '6px',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 16px rgba(106, 17, 203, 0.4)'
                                        }
                                    }}
                                >

                                    <Logo>
                                        Leaves
                                    </Logo>
                                    <Box sx={{
                                        flex: 1,
                                        minHeight: 0,
                                        width: '100%',
                                        height: 'calc(100% - 24px)',
                                        overflow: 'hidden',
                                        '& > *': {
                                            width: '100% !important',
                                            height: '100% !important'
                                        }
                                    }}>
                                        <GaugeChart data={leaveData?.remaining_leaves || 15} maxValue={leaveData?.max_allowed_leaves || 22} />
                                    </Box>
                                </Box>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} sx={{ height: { xs: '40%', md: '48%' }, padding: '2px' }}>
                            <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                <Box
                                    className="glass-panel"
                                    sx={{
                                        borderRadius: '12px',
                                        padding: '6px',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 16px rgba(106, 17, 203, 0.4)'
                                        }
                                    }}
                                >
                                    <Logo>
                                        Monthwise Leaves
                                    </Logo>
                                    <Box sx={{
                                        flex: 1,
                                        minHeight: 0,
                                        width: '100%',
                                        height: 'calc(100% - 24px)',
                                        overflow: 'hidden',
                                        '& > *': {
                                            width: '100% !important',
                                            height: '100% !important'
                                        }
                                    }}>
                                        <LineChart data={monthwiseLeave} />
                                    </Box>
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </motion.div>
            </DashboardContent>
        </DashboardLayout>
    );
};

export default Dashboard; 