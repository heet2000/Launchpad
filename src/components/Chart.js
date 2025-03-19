import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ChartContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ChartTitle = styled(motion.h2)`
  color: var(--primary-color);
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
`;

const ChartCard = styled(motion.div)`
  width: 100%;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 215, 0, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
`;

const ChartControls = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ControlButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  color: var(--primary-color);
  border: 1px solid rgba(255, 215, 0, 0.1);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    border-color: rgba(255, 215, 0, 0.2);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.1);
    transform: translateY(-2px);
  }

  &.active {
    background: linear-gradient(45deg, 
      rgba(255, 215, 0, 0.2), 
      rgba(184, 134, 11, 0.2)
    );
    border-color: rgba(255, 215, 0, 0.3);
    color: var(--primary-color);
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }
`;

const Chart = ({ title, timeRanges, children }) => {
    const [selectedRange, setSelectedRange] = useState(timeRanges[0]);

    return (
        <ChartContainer>
            <ChartTitle
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {title}
            </ChartTitle>

            <ChartControls>
                {timeRanges.map((range) => (
                    <ControlButton
                        key={range}
                        className={selectedRange === range ? 'active' : ''}
                        onClick={() => setSelectedRange(range)}
                    >
                        {range}
                    </ControlButton>
                ))}
            </ChartControls>

            <div className="animated-border">
                <ChartCard
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Chart component from your charting library */}
                    {children}
                </ChartCard>
            </div>
        </ChartContainer>
    );
};

export default Chart; 