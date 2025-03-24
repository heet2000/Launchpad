import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaUserTag, FaUserTie, FaLock } from 'react-icons/fa';
import { GiSkills } from "react-icons/gi";
import { GrUserManager } from "react-icons/gr";
import axios from 'axios';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const RegisterCard = styled(motion.div)`
  width: 100%;
  max-width: 400px;
`;

const RegisterTitle = styled.h2`
  margin-bottom: 30px;
  color: var(--primary-color);
  font-size: 28px;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.1);
`;

const RegisterForm = styled.form`
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
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: var(--dark-color);
  transition: all 0.3s ease;
  margin-top: 20px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #9e9e9e, #757575);
    cursor: not-allowed;
    box-shadow: none;
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

const LoginLink = styled.div`
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
      color: var(--accent-color);
      text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
    }
  }
`;

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [reportsTo, setReportsTo] = useState('');
  const [skills, setSkills] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !role || !level || !reportsTo || !skills || !password) {
      setError('Please fill in all fields');
      return;
    }

    const userData = {
      name,
      email,
      phone,
      role,
      level: parseInt(level, 10),
      reportsTo: parseInt(reportsTo, 10),
      skills,
      password
    };

    try {
      setError('');
      setLoading(true);

      localStorage.setItem('registeredUser', JSON.stringify(userData));
      const response = await axios.post('https://e78a-2401-4900-1cb2-8c47-60ed-23ee-446f-d0f3.ngrok-free.app/register', userData, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'abcdef'
        }
      });

      if (response.status === 201 || response.status === 200) {
        // Store user credentials and empId in localStorage
        const userData = {
          email,
          password,
          empId: response.data.id || response.data.empId,
          name
        };
        localStorage.setItem('registeredUser', JSON.stringify(userData));

        setSuccess('Account created successfully! Redirecting to login...');
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      setError('Failed to create an account. ' + (error.response?.data?.message || error.message));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animated-border">
          <div className="form-card">
            <RegisterTitle>Create Account</RegisterTitle>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  color: 'var(--success-color)',
                  fontSize: '14px',
                  marginBottom: '15px',
                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  padding: '10px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '1px solid rgba(0, 255, 0, 0.2)'
                }}
              >
                {success}
              </motion.div>
            )}

            <RegisterForm onSubmit={handleSubmit}>
              <InputGroup>
                <InputIcon>
                  <FaUser />
                </InputIcon>
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </InputGroup>

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
                  <FaPhone />
                </InputIcon>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputIcon>
                  <FaUserTag />
                </InputIcon>
                <Input
                  type="text"
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputIcon>
                  <FaUserTie />
                </InputIcon>
                <Input
                  type="number"
                  placeholder="Level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputIcon>
                  <GrUserManager />
                </InputIcon>
                <Input
                  type="number"
                  placeholder="Reports To"
                  value={reportsTo}
                  onChange={(e) => setReportsTo(e.target.value)}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputIcon>
                  <GiSkills />
                </InputIcon>
                <Input
                  type="text"
                  placeholder="Skills (comma separated)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
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
                {loading ? 'Creating Account...' : 'Register'}
              </SubmitButton>
            </RegisterForm>

            <LoginLink>
              Already have an account? <Link to="/">Login</Link>
            </LoginLink>
          </div>
        </div>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register; 