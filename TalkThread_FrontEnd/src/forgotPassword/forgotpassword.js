import React, { useState } from 'react';
import { Stack, TextField, Button, Typography, FormControlLabel, Checkbox, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Use useNavigate hook for navigation
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [success, setSuccess] = useState(false); // State to handle successful password reset

  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
  
    try {
      const res = await axios.put("http://localhost:5000/sign/forgotPassword", {
        email,
        newPassword
      });      
      console.log(res);
      if (res.status === 200) {
        alert('Password updated successfully!');
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess(true); // Set success to true
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Email and new password are required');
        } else if (error.response.status === 404) {
          setError('User not found');
        } else if (error.response.status === 500) {
          setError('Internal Server Error. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  // Navigate to sign in page if success
  if (success) {
    navigate('/signin');
  }

  return (
    <Stack justifyContent="center" alignItems="center" height="100vh"> {/* Center the layout */}
     
    <Box p={3} boxShadow={3} bgcolor="rgb(210, 220, 290)" width={400} height={500} display="flex" flexDirection="column"  sx={{ borderRadius: 2 }}>
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} sx={{ width: '300px', margin: '0 auto' }}>
        <Typography variant='h6' color={'Purple'}>
          Enter your registered email address to reset your password.
        </Typography>
        <Typography variant="h5">Forgot Password</Typography>

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'black', // Sets the default border color
            },
          }
          }}
          required
        />
        
        <TextField
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'black', // Sets the default border color
            },
          }
          }}
          required
        />
        
        <TextField
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'black', // Sets the default border color
            },
          }
          }}
          required
        />

        <FormControlLabel
          control={
            <Checkbox 
              checked={showPassword} 
              onChange={(e) => setShowPassword(e.target.checked)}
              color="primary"
            />
          }
          label="Show Password"
        />

        {error && <Typography color="error">{error}</Typography>}
     
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            width: '100%',   // Full width button
            padding: '10px 20px',   // Consistent padding
            fontSize: '16px',   // Ensure consistent font size
          }}
        >
          Reset Password
        </Button>
      </Stack>
    </form>
    </Box>
    </Stack>
  );
}
