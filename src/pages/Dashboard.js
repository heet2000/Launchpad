import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Box, Typography, Grid } from '@mui/material';
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
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const firestore = getFirestore();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [isTablet, setIsTablet] = useState(window.innerWidth > 600 && window.innerWidth <= 960);

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

    // Fetch user's files from Firestore
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const q = query(
                    collection(firestore, 'files'),
                    where('userId', '==', currentUser?.uid || 'guest')
                );

                const querySnapshot = await getDocs(q);
                const filesData = [];

                querySnapshot.forEach((doc) => {
                    filesData.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                // Sort by creation date (newest first)
                filesData.sort((a, b) => {
                    return b.createdAt?.toDate() - a.createdAt?.toDate();
                });

                setFiles(filesData);
            } catch (error) {
                console.error('Error fetching files:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchFiles();
        } else {
            setLoading(false);
        }
    }, [currentUser, firestore]);

    // Get file stats
    const totalFiles = files.length;
    const totalSizeBytes = files.reduce((acc, file) => acc + (file.fileSize || 0), 0);
    const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

    // Format date for display
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown date';

        try {
            const date = timestamp.toDate();
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

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
                                        <Calender />
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
                                        <GaugeChart data={15} maxValue={24} />
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
                                        <LineChart />
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