import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Stack, Typography, Avatar, Modal, TextField, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from '../Home/navbar';
import Profile from '../Profile/profile';
import { useNavigate } from 'react-router-dom';

// Chat Account Component: Displays user details
const ChatAccounts = ({ user, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: '100%',
        borderRadius: 2,
        backgroundColor: '#fff',
        '&:hover': { backgroundColor: 'lightgray' },
        cursor: 'pointer',
        mb: 1,
      }}
      p={1}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <Avatar src={user?.avatar || '/default-avatar.png'} />
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{user?.name || 'User'}</Typography>
            <Typography variant="caption">Keep always smile on your face</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

const Search = () => {
    const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [open, setOpen] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/sign/Search");
      setResults(res.data);
    } catch (error) {
      console.error('Error fetching search data:', error);
    }
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInput(newValue);
    setFilteredResults(
      newValue ? results.filter((user) =>
        user?.name.toLowerCase().includes(newValue.toLowerCase())
      ) : []
    );
  };

  const handleUserClick = (userId) => {
    setSelectedUser(userId); 
    console.log(userId);
     navigate(`/Profile/${userId}`);
    
    setOpen(false); // Close the search modal
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box display={'flex'} flexDirection={"row"} height={'100vh'} width={"100%"}>
      <Navbar />
      <Modal open={open} onClose={() => setOpen(false)} sx={{ backdropFilter: "blur(4px)" }}>
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -20%)",
            width: 390,
            backgroundColor: "#fff",
            boxShadow: 24,
            borderRadius: 2,
            p: 2,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Search Profile</Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <TextField
            variant="outlined"
            placeholder="Search Users..."
            value={input}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />

          {input && (
            <Paper
              elevation={0}
              sx={{
                maxHeight: "350px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: 1,
                p: 1,
              }}
            >
              {filteredResults.length > 0 ? (
                filteredResults.map((user) => (
                  <ChatAccounts
                    key={user._id}
                    user={user}
                    onClick={() => handleUserClick(user._id)}
                  />
                ))
              ) : (
                <Box sx={{ p: 2, textAlign: "center", color: "#888" }}>
                  No user found
                </Box>
              )}
            </Paper>
          )}
        </Box>
      </Modal>

      {/* Render Profile component when a user is selected */}
     
    </Box>
  );
};

export default Search;
