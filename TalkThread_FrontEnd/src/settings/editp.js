import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Stack, TextField, Button, Avatar, Typography, Snackbar, Alert, Box } from '@mui/material';
import defaultImage from './defaultImage.png';
import axios from 'axios';
import { useAuth } from '../Routes/AuthContex';

const Editp = () => {
    const [avatar, setAvatar] = useState(null);
    const [bio, setBio] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const auth = useAuth();
    const navigate = useNavigate();
    const [username,setUser]=useState(null);
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSnackbarMessage('Please upload a valid image file.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const validateInputs = () => {
        if (bio.length > 160) {
            setSnackbarMessage('Bio should not exceed 160 characters.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateInputs()) return;

        const formData = {
            username,
            bio,
            email: auth.user.email,
            profileImage: avatar
        };

        try {
            const response = await axios.put(
                'http://localhost:5000/CreateProfile/CreateUserProfile',
                formData,
              );
            setSnackbarMessage('Profile updated successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setTimeout(() => navigate("/profile"), 2000); // Redirect after delay
        } catch (error) {
            console.error('Error creating profile:', error.response?.data || error.message);
            setSnackbarMessage('Failed to update profile. Please try again.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <Stack justifyContent="center" alignItems="center" height="500px">
            <Box boxShadow={3} width={400} height={500} display="flex" flexDirection="column" sx={{ borderRadius: 2 }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} sx={{ width: '300px', margin: '0 auto', paddingTop: '50px' }}>
                        <Typography variant="h5" align="center">Edit Profile</Typography>
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
                        <TextField
                            label="Bio"
                            multiline
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                        <Button variant="contained" color="primary" type="submit">
                            Save Profile
                        </Button>
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

export default Editp;
