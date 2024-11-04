import React, { useState } from 'react';
import { Box } from '@mui/material';
import Chatlist from "./chatList";
import Chat from "./chat";
export default function GenerateChatApp() {
 
  return (
      <Box sx={{ display: 'flex', flexGrow: 1, width:"80%"}}>
        <Chatlist /> 
        <Chat /> 
      </Box>
  );
}
