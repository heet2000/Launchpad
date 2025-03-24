import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTachometerAlt, FaFileUpload, FaBars, FaTimes, FaCheckCircle, FaSignOutAlt, FaVideo } from 'react-icons/fa';
import { Checkbox, FormControlLabel, Typography, Snackbar, Alert, Button, Modal, Box } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import QRCodeImage from '../assets/QR_Code.png';
import { fetchAttendanceData } from '../charts/calendar';

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

const NavButton = styled.button`
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
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 16px;

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
`;

const ModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background: rgba(20, 20, 30, 0.95);
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(157, 0, 255, 0.5);
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: glowPulse 3s infinite alternate;
  
  @keyframes glowPulse {
    from {
      box-shadow: 0 0 20px rgba(157, 0, 255, 0.3);
    }
    to {
      box-shadow: 0 0 40px rgba(157, 0, 255, 0.7);
    }
  }
`;

const QRCodeContainer = styled.div`
  margin: 25px 0;
  padding: 20px;
  background: white;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const QRImage = styled.div`
  width: 200px;
  height: 200px;
  background-color: #fff;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #333;
  border-radius: 5px;
  
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const StepTitle = styled.h3`
  color: var(--primary-color);
  margin-bottom: 20px;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(157, 0, 255, 0.5);
  letter-spacing: 0.5px;
`;

const StepList = styled.ol`
  color: var(--light-color);
  margin-left: 20px;
  width: 100%;
  
  li {
    margin-bottom: 15px;
    line-height: 1.5;
    font-size: 16px;
    
    strong {
      color: var(--primary-color);
      font-weight: 600;
    }
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
  const [openTwilioModal, setOpenTwilioModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Check if attendance was already marked today
  useEffect(() => {
    const checkTodayAttendance = async () => {
      // Check localStorage first
      const lastAttendanceDate = localStorage.getItem('lastAttendanceDate');
      const today = formatDate();

      if (lastAttendanceDate === today) {
        setIsPresent(true);
        return;
      }

      // If not in localStorage, check with the API
      try {
        // Get empId and authToken
        const empId = currentUser?.empId;
        const authToken = localStorage.getItem('authToken');

        if (empId && authToken) {
          // Fetch attendance data from API using the exported function
          const attendanceData = await fetchAttendanceData(empId, authToken);

          if (attendanceData && Array.isArray(attendanceData.PRESENT)) {
            // Check if today's date is in the PRESENT array
            const todayStr = today; // Already in YYYY-MM-DD format
            const isMarkedPresent = attendanceData.PRESENT.some(date => date === todayStr);

            if (isMarkedPresent) {
              setIsPresent(true);
              localStorage.setItem('lastAttendanceDate', today);
            }
          }
        }
      } catch (error) {
        console.error('Error checking attendance status:', error);
      }
    };

    checkTodayAttendance();
  }, [currentUser]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const formatDate = () => {
    // Use March 2025 for the attendance date to match our calendar
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    return `2025-03-${day}`;
  };

  const handlePresentChange = async (event) => {
    const isChecked = event.target.checked;
    setIsPresent(isChecked);

    setLoading(true);

    try {
      // Get empId from localStorage
      const empId = currentUser.empId;
      // Get authentication token from localStorage
      const authToken = localStorage.getItem('authToken');

      if (!empId) {
        throw new Error('Employee ID not found. Please log in again.');
      }

      if (!authToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Get formatted date (will be in March 2025)
      const date = formatDate();

      // Send attendance data to API with authToken in header
      const response = await axios.post('https://4bfb-2401-4900-1cb2-8c47-60ed-23ee-446f-d0f3.ngrok-free.app/attendance', {
        empId: empId,
        date: date,
        status: isChecked ? 'Present' : "Absent"
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.status === 201 || response.status === 200) {
        // Save today's date as last attendance date
        localStorage.setItem('lastAttendanceDate', date);

        setMessage('Attendance marked successfully!');
        setMessageType('success');
        setOpenSnackbar(true);

        // Dispatch custom event to notify calendar component to refresh data
        window.dispatchEvent(new CustomEvent('attendanceMarked', {
          detail: {
            date: date,
            status: isChecked ? 'Present' : 'Absent',
            empId: empId
          }
        }));
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
  };

  const handleOpenTwilioModal = () => {
    setOpenTwilioModal(true);
  };

  const handleCloseTwilioModal = () => {
    setOpenTwilioModal(false);
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
    }, 500);
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
          {currentUser?.email === "admin@payoda.com" && (
            <NavLink
              to="/upload"
              className={location.pathname === '/upload' ? 'active' : ''}
            >
              <FaFileUpload />
              <span>Upload Files</span>
            </NavLink>
          )}

          <NavButton onClick={handleOpenTwilioModal}>
            <FaVideo />
            <span>WhatsApp Q&A</span>
          </NavButton>
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

      {/* Twilio Join Modal */}
      <Modal
        open={openTwilioModal}
        onClose={handleCloseTwilioModal}
        aria-labelledby="twilio-modal-title"
        sx={{
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}
      >
        <ModalContent>
          <StepTitle id="twilio-modal-title">Start Q&A with Twilio</StepTitle>

          <QRCodeContainer>
            <QRImage>
              <img src={QRCodeImage} alt="Twilio QR Code" />
            </QRImage>
          </QRCodeContainer>

          <StepTitle>Follow these steps to join:</StepTitle>
          <StepList>
            <li>Open WhatsApp on your device</li>
            <li>Send a message to <strong>+1 415 523 8886</strong></li>
            <li>Type the code <strong>join stomach-six</strong></li>
            <li>Wait for confirmation</li>
            <li>Now you can start asking questions!</li>
          </StepList>

          <Button
            variant="contained"
            onClick={handleCloseTwilioModal}
            sx={{
              mt: 4,
              py: 1.2,
              px: 4,
              background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
              color: 'var(--dark-color)',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(157, 0, 255, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 20px rgba(157, 0, 255, 0.5)',
              }
            }}
          >
            Close
          </Button>
        </ModalContent>
      </Modal>

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