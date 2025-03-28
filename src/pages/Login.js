import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const LoginCard = styled(motion.div)`
  width: 100%;
  max-width: 400px;
`;

const LoginTitle = styled.h2`
  margin-bottom: 30px;
  color: var(--primary-color);
  font-size: 28px;
  text-align: center;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 45px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 8px;
  font-size: 16px;
  color: var(--primary-color);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: var(--dark-color);
  margin-top: 20px;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  font-size: 14px;
  margin-bottom: 15px;
  background-color: rgba(255, 0, 0, 0.1);
  padding: 10px;
  border-radius: 8px;
  text-align: left;
  border: 1px solid rgba(255, 0, 0, 0.2);
`;

const RegisterLink = styled.div`
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  color: var(--light-color);
  
  a {
    color: var(--primary-color);
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if user is already authenticated and redirect to dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);

      navigate('/dashboard');
    } catch (error) {
      setError('Failed to log in. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animated-border">
          <div className="form-card">
            <LoginTitle>Welcome to DocuSeek</LoginTitle>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <LoginForm onSubmit={handleSubmit}>
              <InputGroup>
                <InputIcon>
                  <FaEnvelope />
                </InputIcon>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </InputGroup>

              <SubmitButton
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </SubmitButton>
            </LoginForm>

            <RegisterLink>
              Don't have an account? <Link to="/register">Register</Link>
            </RegisterLink>
          </div>
        </div>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 