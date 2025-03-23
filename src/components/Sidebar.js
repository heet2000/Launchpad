import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTachometerAlt, FaFileUpload, FaBars, FaTimes, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import { Checkbox, FormControlLabel, Typography, Snackbar, Alert, Button } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SidebarContainer = styled(motion.div)`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 215, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    transform: translateX(${({ isOpen }) => (isOpen ? '0' : '-100%')});
  }
`;

const Logo = styled.div`
  color: var(--primary-color);
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
`;

const NavLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  color: var(--light-color);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  background: rgba(0, 0, 0, 0.3);

  svg {
    font-size: 20px;
    color: var(--primary-color);
    opacity: 0.8;
    transition: all 0.3s ease;
  }

  &:hover {
    background: rgb(199 0 255 / 15%);
    border-color: rgb(213 0 255 / 25%);
    transform: translateX(5px);
  }

  &.active {
    background: rgb(199 0 255 / 15%);
    border-color: rgb(213 0 255 / 25%);
    color: #9d00ff;
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  left: ${({ isOpen }) => (isOpen ? '250px' : '20px')};
  top: 20px;
  z-index: 101;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.1);
  color: var(--primary-color);
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 215, 0, 0.1);
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const AttendanceContainer = styled.div`
  margin-top: auto;
  padding: 20px;
  border-top: 1px solid rgba(225, 0, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
`;

const LogoutButton = styled(Button)`
  width: 100%;
  margin-top: 15px !important;
  background: rgba(255, 0, 0, 0.2) !important;
  color: #ff5252 !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    background: rgba(255, 0, 0, 0.3) !important;
  }
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPresent, setIsPresent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Check if attendance was already marked today
  useEffect(() => {
    const checkTodayAttendance = () => {
      const lastAttendanceDate = localStorage.getItem('lastAttendanceDate');
      const today = new Date().toISOString().split('T')[0];

      if (lastAttendanceDate === today) {
        setIsPresent(true);
      }
    };

    checkTodayAttendance();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const formatDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handlePresentChange = async (event) => {
    const isChecked = event.target.checked;
    setIsPresent(isChecked);

    if (isChecked && currentUser) {
      setLoading(true);

      try {
        // Get empId from localStorage
        const empId = currentUser.empId;

        if (!empId) {
          throw new Error('Employee ID not found. Please log in again.');
        }

        // Send attendance data to API
        const response = await axios.post('http://127.0.0.1:5003/attendance', {
          empId: empId,
          date: formatDate(),
          status: 'Present'
        });

        if (response.status === 201 || response.status === 200) {
          // Save today's date as last attendance date
          localStorage.setItem('lastAttendanceDate', formatDate());

          setMessage('Attendance marked successfully!');
          setMessageType('success');
          setOpenSnackbar(true);
        } else {
          throw new Error('Failed to mark attendance');
        }
      } catch (error) {
        setIsPresent(false);
        setMessage(error.response?.data?.message || error.message || 'Failed to mark attendance');
        setMessageType('error');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleLogout = () => {
    logout();
    setOpenSnackbar(true);
    setMessage('Successfully logged out');
    setMessageType('success');

    // Navigate to login page after a brief delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <>
      <ToggleButton
        onClick={toggleSidebar}
        isOpen={isOpen}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </ToggleButton>

      <SidebarContainer
        isOpen={isOpen}
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Logo>LaunchPad</Logo>

        <NavLinks>
          <NavLink
            to="/dashboard"
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/upload"
            className={location.pathname === '/upload' ? 'active' : ''}
          >
            <FaFileUpload />
            <span>Upload Files</span>
          </NavLink>
        </NavLinks>

        <AttendanceContainer>
          <FormControlLabel
            control={
              <Checkbox
                checked={isPresent}
                onChange={handlePresentChange}
                disabled={loading}
                sx={{
                  color: 'rgba(138, 92, 245, 0.7)',
                  '&.Mui-checked': {
                    color: 'var(--primary-color)',
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  color: isPresent ? '#a18cd1' : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: isPresent ? 600 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                }}
              >
                {loading ? 'Marking Attendance...' : 'Mark Present'}
                {isPresent && <FaCheckCircle color="#4cd964" />}
              </Typography>
            }
          />

          <LogoutButton
            startIcon={<FaSignOutAlt />}
            onClick={handleLogout}
          >
            Logout
          </LogoutButton>
        </AttendanceContainer>
      </SidebarContainer>

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
    </>
  );
};

export default Sidebar; 