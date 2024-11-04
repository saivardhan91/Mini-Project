import React from 'react';
import { Box } from '@mui/material';
import Chatlist from "./chatList";
import Nav from "./nav";
import Chat from "./chat";

export default function GenerateChatApp() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Nav />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Chatlist /> 
        <Chat /> 
      </Box>
    </Box>
  );
}
