import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: ${({ hasSidebar, sidebarOpen }) =>
    hasSidebar
      ? sidebarOpen
        ? '0 0 0 250px'
        : '0 0 0 70px'
      : '0'
  };
  transition: padding 0.3s ease;
  height: ${({ hideNavbar }) => hideNavbar ? '100vh' : 'calc(100vh - 70px)'};
  
  @media (max-width: 768px) {
    padding: ${({ hasSidebar, sidebarOpen }) =>
    hasSidebar && sidebarOpen ? '0 0 0 250px' : '0'
  };
    height: ${({ hideNavbar }) => hideNavbar ? '100vh' : 'calc(100vh - 60px)'};
  }
`;

const ScrollableContent = styled.div`
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--primary-color) rgba(12, 14, 34, 0.5);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(12, 14, 34, 0.5);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--primary-color);
    border-radius: 3px;
  }
`;

const Layout = ({ children, hasSidebar = false, hideNavbar = false }) => {
  // Create state to track sidebar open/closed state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Event listener to track sidebar state changes
  useEffect(() => {
    const handleSidebarChange = (e) => {
      if (e.detail && typeof e.detail.isOpen === 'boolean') {
        setSidebarOpen(e.detail.isOpen);
      }
    };

    window.addEventListener('sidebarToggle', handleSidebarChange);

    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarChange);
    };
  }, []);

  return (
    <PageContainer>
      {!hideNavbar && <Navbar />}

      <ContentContainer
        hasSidebar={hasSidebar}
        hideNavbar={hideNavbar}
        sidebarOpen={sidebarOpen}
      >
        <ScrollableContent>
          {children}
        </ScrollableContent>
      </ContentContainer>
    </PageContainer>
  );
};

export default Layout; 