import React from 'react';
import Layout from './Layout';
import Sidebar from './Sidebar';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 20px;
`;

const DashboardLayout = ({ children }) => {
    return (
        <Layout hasSidebar={true} hideNavbar={true}>
            <Sidebar />
            <DashboardContainer>
                {children}
            </DashboardContainer>
        </Layout>
    );
};

export default DashboardLayout; 