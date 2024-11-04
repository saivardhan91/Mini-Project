import React, { useEffect, useState } from 'react';
import Navbar from '../Home/navbar';
import { Box, Card, CardContent, CardActions, Typography, TextField, Button, IconButton, Snackbar, Alert } from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import axios from 'axios'; // Import Axios for making HTTP requests
import { useAuth } from '../Routes/AuthContex';
const CreatePost = () => {
    const [post, setPost] = useState(null);
    const [caption, setCaption] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [userId, setUserId] = useState(''); // Placeholder for user ID
    const [name, setName] = useState(''); // Placeholder for user name
    const [email, setEmail] = useState(''); // Placeholder for user email
    const [userData,setUserData]=useState('');
    const auth = useAuth();
    // console.log("createpost",auth);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPost(file); // Set the file for upload
        }
    };
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/sign/user/${auth?.user?._id}`);
                console.log("create", res.data); // Log the user data
                setUserData(res.data); // Set user data to state
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle error (optional)
            }
        };

        if (auth?.user?._id) {
            fetchUserData(); // Fetch user data only if user ID is available
        }
    }, [auth?.user?._id]);

    const handleCaptionChange = (e) => {
        const newCaption = e.target.value;
        if (newCaption.length <= 50) {
            setCaption(newCaption);
        } else {
            setSnackbarOpen(true); // Show snackbar if caption exceeds 50 characters
        }
    };

    const removeImage = () => {
        setPost(null); // Clear the image file
    };

    const uploadPost = async () => {
        if (!post || caption.length > 50) {
            // Prevent uploading if no image is selected or caption exceeds limit
            return;
        }

        const formData = new FormData();
        formData.append('image', post); // Append the image file
        formData.append('userId', auth?.user?._id); // Append user ID
        formData.append('name', userData?.username); // Append user name
        formData.append('email', auth?.user?.email); // Append user email
        formData.append('caption', caption); // Append caption

        try {
            const response = await axios.post('http://localhost:5000/post/Createposts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Specify the content type
                },
            });
            // Handle success (e.g., show a success message or reset the form)
            setPost(null); // Clear the image file
            setCaption(''); // Clear the caption
            console.log(response.data); // Optional: display the response in console
            // Optionally reset form state here

        } catch (error) {
            console.error('Error uploading post:', error);
            // Handle error (e.g., show an error message)
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100vh', padding: 0, margin: 0 }}>
            <Navbar />

            <Box sx={{
                flexGrow: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'background.default',
            }}>
                <Card sx={{
                    width: 500,
                    height: 650,
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: 3,
                    overflow: 'hidden'
                }}>
                    <CardContent sx={{ width: '100%', textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Create a New Post
                        </Typography>

                        <Box display="flex" alignItems="center" flexDirection="column" gap={1} mt={1}>
                            {/* File input with preview */}
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<PhotoCamera />}
                                sx={{ width: '100%' }}
                            >
                                Choose Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Button>

                            {/* Image Preview Box */}
                            {post && (
                                <>
                                    <Box 
                                        component="img" 
                                        src={URL.createObjectURL(post)} // Create URL for image preview
                                        alt="Preview" 
                                        sx={{
                                            width: '100%',
                                            height: 250,
                                            objectFit: 'cover',
                                            borderRadius: 1,
                                            mt: 1,
                                        }} 
                                    />
                                    <IconButton onClick={removeImage} color="error" sx={{ mt: 0 }}>
                                        <Delete />
                                    </IconButton>
                                </>
                            )}

                            {/* Caption input */}
                            <TextField
                                label="Caption"
                                multiline
                                rows={3}
                                variant="outlined"
                                fullWidth
                                value={caption}
                                onChange={handleCaptionChange}
                                sx={{ mt: 1 }}
                                helperText={`${caption.length}/50`}
                            />
                        </Box>
                    </CardContent>

                    <CardActions sx={{ width: '100%', justifyContent: 'center' }}>
                        <Button variant="contained" color="primary" onClick={uploadPost} fullWidth>
                            Upload
                        </Button>
                    </CardActions>
                </Card>
            </Box>

            {/* Snackbar for character limit warning */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="warning">
                    Caption cannot exceed 50 characters.
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CreatePost;
