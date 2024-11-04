import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Avatar } from '@mui/material';
import close from '../chatApplication/images/close.png'; // Ensure the path is correct
import socket from '../socket';

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
            <Typography variant="caption">{'Keep always smile on your face'}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

ChatAccounts.propTypes = {
  user: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

// Fetch or create a new chat between sender and receiver
const fetchOrCreateChat = async (senderId, receiverId, fetchConversations) => {
  try {
    // Try to get the existing conversation
    const res = await axios.get(`http://localhost:5000/sign/conversation`, {
      params: { senderId, receiverId },
    });
    fetchConversations();
    
    if (res.data) {
      console.log("res.data",res.data._id);
      const ConvUpdateDate= await axios.put(`http://localhost:5000/sign/UpdateConversationDate/${res.data._id}`);
      console.log("updateddate",ConvUpdateDate);
      
      // return res.data;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // If conversation doesn't exist, create a new one
      const newConversation = await axios.post(`http://localhost:5000/sign/conversation`, {
        senderId,
        receiverId,
      });
      console.log("newcon",newConversation);
      
      fetchConversations(); // Fetch after creation
      
      return newConversation.data;
    } else {
      console.error('Error fetching or creating conversation:', error);
    }
  }
};

const SearchAndChat = ({ handleClose, CUser, onSelectChat, fetchConversations }) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/sign/Search");
      setResults(res.data);
    } catch (error) {
      console.error('Error fetching search data:', error);
    }
  };

  // Filter results based on input
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInput(newValue);
    if (newValue) {
      const filtered = results.filter((user) =>
        user?.name.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults([]);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Handle clicking on a user to start a chat
  const handleChatClick = async (receiverId) => {
    if (receiverId === CUser._id) {
      alert('Cannot start a conversation with yourself.');
      return;
    }
    try {
      const conversation = await fetchOrCreateChat(CUser._id, receiverId, fetchConversations);
      onSelectChat(conversation);
      handleClose(); 
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        left: 280,
        height: "490px",
        width: "390px",
        backgroundColor: "#fff",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 10,
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="newChat"
        style={{
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">New Chat</Typography>
        <img
          src={close}
          alt="close"
          width={"20px"}
          height={"20px"}
          style={{ cursor: "pointer" }}
          onClick={handleClose}
        />
      </div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Search Users..."
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid #ddd",
          color: "black",
        }}
      />
      {input && (
        <div
          style={{
            maxHeight: "350px",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          {filteredResults.length > 0 ? (
            filteredResults.map((user) => (
              <div key={user._id} onClick={() => handleChatClick(user._id)}>
                <ChatAccounts user={user} />
              </div>
            ))
          ) : (
            <div
              style={{
                padding: "10px",
                textAlign: "center",
                color: "#888",
              }}
            >
              No user found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SearchAndChat.propTypes = {
  handleClose: PropTypes.func.isRequired,
  CUser: PropTypes.object.isRequired,
  onSelectChat: PropTypes.func.isRequired,
  fetchConversations: PropTypes.func.isRequired,  // Added missing prop validation
};

export default SearchAndChat;
