import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaTachometerAlt, FaFileUpload, FaBars, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { motion } from 'framer-motion';

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
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
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
    background: rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.2);
    transform: translateX(5px);
    
    svg {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  &.active {
    background: rgba(255, 215, 0, 0.15);
    border-color: rgba(255, 215, 0, 0.25);
    color: var(--primary-color);
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.2);

    svg {
      opacity: 1;
      transform: scale(1.1);
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
    border-color: rgba(255, 215, 0, 0.2);
    transform: scale(1.05);
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const AttendanceContainer = styled.div`
  margin-top: auto;
  padding: 20px;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.05);
    border-color: rgba(255, 215, 0, 0.2);
  }

  .MuiFormControlLabel-root {
    margin: 0;
    width: 100%;
  }

  .MuiCheckbox-root {
    color: rgba(255, 215, 0, 0.5);
    
    &.Mui-checked {
      color: var(--primary-color);
    }
  }

  .MuiTypography-root {
    color: var(--light-color);
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    svg {
      color: var(--success-color);
    }
  }
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPresent, setIsPresent] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handlePresentChange = (event) => {
    setIsPresent(event.target.checked);
    // Here you could add code to save the present status to your database
    console.log(`User marked as ${event.target.checked ? 'present' : 'absent'}`);
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

        <AttendanceContainer isOpen={isOpen}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isPresent}
                onChange={handlePresentChange}
                sx={{
                  color: 'rgba(138, 92, 245, 0.7)',
                  '&.Mui-checked': {
                    color: 'var(--primary-color)',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: 28,
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
                  transition: 'all 0.3s ease'
                }}
              >
                Mark Present
                {isPresent && <FaCheckCircle color="#4cd964" />}
              </Typography>
            }
            sx={{
              margin: 0
            }}
          />
        </AttendanceContainer>
      </SidebarContainer>
    </>
  );
};

export default Sidebar; 