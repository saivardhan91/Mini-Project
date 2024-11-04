import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box, InputAdornment, IconButton, Stack,Divider } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../Routes/AuthContex';
import './login.css';
export default function Login({ action }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const auth = useAuth(); // Use auth context
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format regex
    const nameRegex = /^[A-Za-z]+$/; // Only alphabets

    if (!emailRegex.test(details.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (action === "Sign Up" && !nameRegex.test(details.name)) {
      toast.error("Username should contain only alphabets");
      return false;
    }

    if (details.password.length < 6) {
      toast.error("Your password length should be minimum six characters");
      return false;
    }

    if (action === "Sign Up" && !isChecked) {
      toast.error("Please agree to the Terms and Conditions");
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validate before submission
    if (!validateForm()) {
      return;
    }

    try {
      if (action === "Sign In") {
        const res = await auth.login(details); // Call the login method from AuthContext
        toast.success("Login successful");
        navigate('/home'); // Navigate to the chat page after login
      } else {
        const res = await auth.signup(details); // Call the signup method from AuthContext
        console.log(res);
        toast.success("Signup successful");
        navigate('/createprofile'); // Navigate to the profile creation page after signup
      }
    } catch (err) {
      console.error(err);

      // Handle backend error response (such as incorrect password or user not found)
      const msg = err;
      toast.error(msg); // Display the error message as a toast notification
    }
  }

  return (
    <Stack justifyContent="center" alignItems="center" height="100vh"> {/* Center the layout */}
     
    <Box p={3} boxShadow={3} bgcolor="background.paper" width={400} height={500} display="flex" flexDirection="column"  sx={{ borderRadius: 2 }}> {/* Fixed width and height */}
    <Typography 
      fontSize={'30px'}
      sx={{ fontFamily: 'Pacifico, cursive', fontWeight: 400 }} 
      marginBottom={7}
      className='heading'
    >
      TalkThread 
    </Typography>
    {/* <Box textAlign="center" marginBottom={2}>
      <Typography variant="h5" gutterBottom>
        {action}
        <Box
        sx={{
          height: '5px', // Adjust thickness here
          width: '22%', // Set width to 50%
          margin: '0 auto',
          borderRadius: '10px', // Rounded edges
          backgroundColor: 'rgb(200, 200, 243);', // Background color
        }}
      />
      </Typography>
      
    </Box> */}
      
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Stack spacing={2} flexGrow={1}> {/* Use flexGrow to push the button to the bottom */}
          {action === "Sign Up" && (
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={details.name}
              onChange={handleInputChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'black', // Sets the default border color
                },
              }
              }}
            />
          )}
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            required
            value={details.email}
            onChange={handleInputChange}
            sx={{
              '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'black', // Sets the default border color
              },
            }
            }}
          />
          <TextField
            name="password"
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type={passwordVisible ? 'text' : 'password'}
            required
            value={details.password}
            onChange={handleInputChange}
            sx={{
              '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'black', // Sets the default border color
              },
            }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {passwordVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        {action === "Sign Up" && (
          <Box display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)} // Handle checkbox change
                />
              }
              label={
                <Typography>
                  Yes, I agree to the <Link to="#">Terms and Conditions</Link>
                </Typography>
              }
            />
          </Box>
        )}

          {action === "Sign In" && (
            <Box textAlign="left">
              <Link to={'/forgot-password'}>Forgot Password?</Link>
            </Box>
          )}
        </Stack>

        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 'auto' }}>
          {action}
        </Button>
      </form>
      <Typography align="center" mt={2}>
        {action === "Sign In" ? (
          <>
            Create an Account?{' '}
            <Link to='/signup' className="link">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link to='/signin' className="link">
              Sign In
            </Link>
          </>
        )}
      </Typography>
    </Box>
  </Stack>
  );
}
