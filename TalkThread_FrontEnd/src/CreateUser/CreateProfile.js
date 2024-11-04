import React, { useState } from 'react';
import { Stack, TextField, Button, Avatar, Typography, Snackbar, Alert, Box } from '@mui/material';
import defaultImage from './defaultImage.png';
import axios from 'axios';
import { useAuth } from '../Routes/AuthContex';
import { Navigate } from 'react-router-dom';

export default function CreateProfile() {
  const [avatar, setAvatar] = useState(null); // For previewing the avatar
  const [base64Avatar, setBase64Avatar] = useState(''); // For storing base64 string
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [redirect, setRedirect] = useState(false); // State to control redirection
  const auth = useAuth();

  // Handle avatar upload and convert it to Base64
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result; // Keep the prefix for content type reference
        setAvatar(base64data);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate username and bio
  const validateInputs = () => {
    if (username.length < 3 || username.length > 20) {
      setSnackbarMessage('Username should be between 3 and 20 characters.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return false;
    }
    if (bio.length > 160) {
      setSnackbarMessage('Bio should not exceed 160 characters.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  // Handle profile submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs before submitting
    if (!validateInputs()) return;

    // Prepare form data with Base64 avatar
    const formData = {
      username,
      bio,
      email: auth.user.email,
      profileImage: avatar // Send base64 image to backend
    };

    try {
      const response = await axios.put(
        'http://localhost:5000/CreateProfile/CreateUserProfile',
        formData,
      );
      setSnackbarMessage('Profile created successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Set redirect to true
      setRedirect(true);
    } catch (error) {
      console.error('Error creating profile:', error.response?.data || error.message);
      setSnackbarMessage('Failed to create profile. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Redirect to dashboard if profile is created successfully
  if (redirect) {
    return <Navigate to="/home" replace />;
  }

  return (
    <Stack justifyContent="center" alignItems="center" height="100vh">
      <Box boxShadow={3} width={400} height={500} display="flex" flexDirection="column" sx={{ borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ width: '300px', margin: '0 auto', paddingTop: '50px' }}>
            <Typography variant="h5" align="center">Create Profile</Typography>

            {/* Avatar Upload */}
            <label htmlFor="avatar-upload">
              <Avatar
                alt="User Avatar"
                src={avatar || defaultImage}
                sx={{ width: 100, height: 100, cursor: 'pointer', margin: '0 auto' }}
              />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />

            {/* Username and Bio Inputs */}
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <TextField
              label="Bio"
              multiline
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            {/* Submit Button */}
            <Button variant="contained" color="primary" type="submit">
              Save Profile
            </Button>

            {/* Snackbar for notifications */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
              <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
}
