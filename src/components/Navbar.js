import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(12, 14, 34, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10;
  border-bottom: 1px solid rgba(138, 92, 245, 0.2);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.6rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  position: relative;
  
  &:after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover:after {
    transform: scaleX(1);
  }
`;

const MenuIcon = styled.div`
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--light-color);
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    flex-direction: column;
    align-items: flex-start;
    width: 70%;
    height: calc(100vh - 60px);
    background-color: rgba(12, 14, 34, 0.9);
    backdrop-filter: blur(10px);
    transition: right 0.3s ease;
    padding: 1rem;
    box-shadow: -4px 10px 20px rgba(0, 0, 0, 0.3);
    border-left: 1px solid rgba(138, 92, 245, 0.2);
  }
`;

const NavLink = styled(Link)`
  margin: 0 1rem;
  color: var(--light-color);
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  
  &:after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: var(--primary-color);
    
    &:after {
      transform: scaleX(1);
    }
  }
  
  @media (max-width: 768px) {
    margin: 1rem 0;
    width: 100%;
  }
`;

const NavButton = styled.button`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  display: flex;
  align-items: center;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  box-shadow: 0 4px 10px rgba(138, 92, 245, 0.3);
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(138, 92, 245, 0.4);
  }
  
  svg {
    margin-right: 5px;
  }
  
  @media (max-width: 768px) {
    margin: 1rem 0;
    width: 100%;
  }
`;

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine if we're on dashboard or upload pages
    const isAppPage = location.pathname === '/dashboard' || location.pathname === '/upload';

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <Nav>
            <Logo to={currentUser ? "/dashboard" : "/"}>LaunchPad</Logo>

            <MenuIcon onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </MenuIcon>

            <NavItems isOpen={menuOpen}>
                {currentUser || isAppPage ? (
                    <>
                        <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
                        <NavLink to="/upload" onClick={() => setMenuOpen(false)}>Upload Files</NavLink>
                        {currentUser && (
                            <NavButton onClick={handleLogout}>
                                <FaSignOutAlt /> Logout
                            </NavButton>
                        )}
                    </>
                ) : (
                    <>
                        <NavLink to="/" onClick={() => setMenuOpen(false)}>Login</NavLink>
                        <NavLink to="/register" onClick={() => setMenuOpen(false)}>Register</NavLink>
                    </>
                )}
            </NavItems>
        </Nav>
    );
};

export default Navbar; 