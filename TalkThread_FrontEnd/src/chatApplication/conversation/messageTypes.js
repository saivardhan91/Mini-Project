import { Stack, Typography, Divider, Box, Link, IconButton,Menu,MenuItem } from "@mui/material";
import React,{useState,useEffect, useRef} from "react";
import { DotsThreeVertical, DownloadSimple, Image } from "@phosphor-icons/react";
import axios from "axios";
import socket from "../../socket";
import { useAuth } from '../../Routes/AuthContex';
// import { format } from 'timeago.js';
import formatDate from './dateformat';

// Component-level socket initialization inside `MessageOption`
export function MessageOption({ onReact, own, messageId, receiver, ele, refreshConversation}) {
  const auth = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [msgId,setMsgId]=useState(null);
  //  console.log(messageId);
  // console.log("reply",ele);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = async () => {
    try {
      if (!ele || !receiver) {
        console.error("Message sender or receiver not defined.");
        return;
      }

      const sender = ele.sender;
     
      // Make the delete request
      const response = await axios.delete(`http://localhost:5000/sign/DeleteMessage/${messageId}`);
      console.log(response);
      // Emit the deleteMessage event if deletion was successful
      if (response.status === 200) {
        socket.emit("deleteMessage", {
          senderId: sender,
          receiverId: receiver,
          messageId: messageId,
        });
        console.log("deleteMessage event emitted");
      }
      handleClose();

    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };


  useEffect(() => {
    const messageDeletedListener = (data) => {
      console.log(data);
      if (data.receiverId) {
        // fetchConversations(); // Refresh conversations after deletion
        refreshConversation(); // Refresh the current conversation
      } else {
        console.error("messageId is undefined in messageDeleted event data");
      }
    };
    
    // Register the listener when the component mounts
    socket.on('messageDeleted', messageDeletedListener);

    // Cleanup function to ensure listener is removed on unmount
    return () => {
      socket.off('messageDeleted', messageDeletedListener); // Cleanup on unmount
    };
  }, []); 
  const handleReaction = async (reactionType) => {
    onReact(reactionType);
    handleClose();
    // console.log(auth.user._id);
    try {
      // Sending a PUT request to update the reaction
      const response = await axios.put(`http://localhost:5000/sign/reaction/${messageId}`, {
        userId:auth?.user?._id , // Assuming currentUserId is available in your component
        type: reactionType,
      });
     socket.emit("reaction",{receiverId:receiver, messageId:messageId});
      // Optionally handle the response, e.g., update local state
      console.log('Reaction updated:', response.data);
    } catch (error) {
      console.error('Error adding reaction:', error);
      // Handle error (e.g., show notification)
    }
  };
    return (
    <Stack>
      <DotsThreeVertical
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
        size={20}
        color="black"
        weight="bold"
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {/* <MenuItem onClick={handleClose}>Reply</MenuItem> */}
        {own && <MenuItem onClick={handleDelete}>Delete</MenuItem>}
        {!own && <MenuItem>
          React:
          <IconButton onClick={() => handleReaction('😭')}>😭</IconButton>
          <IconButton onClick={() => handleReaction('👍')}>👍</IconButton>
          <IconButton onClick={() => handleReaction('❤️')}>❤️</IconButton>
          <IconButton onClick={() => handleReaction('😂')}>😂</IconButton>
          <IconButton onClick={() => handleReaction('😠')}>😠</IconButton>
        </MenuItem>
       }
      </Menu>
        
    </Stack>
  );
}

export function ReplyMessage({ ele, own, receiver, refreshConversation }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Stack
      direction={"row"}
      justifyContent={ele ? "start" : "end"}
      alignItems={"center"}
      spacing={2}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box p={1.5} sx={{ backgroundColor: ele ? "whitesmoke" : "skyblue", borderRadius: "10px", width: "max-content" }}>
        <Stack spacing={2}>
          <Stack p={2} direction={"column"} alignItems={"center"} spacing={1} sx={{ backgroundColor: "white", borderRadius: 1 }}>
            <Typography variant="body2" color={"black"}>{ele.message}</Typography>
          </Stack>
          <Typography variant="body2">{ele.reply}</Typography>
        </Stack>
      </Box>
      {hovered && (
        <MessageOption
          onReact={(emoji) => {}}
          own={own}
          messageId={ele._id}
          receiver={receiver}
          ele={ele}
          refreshConversation={refreshConversation}
        />
      )}
    </Stack>
  );
}

export function MediaMessage({ ele, own, receiver, refreshConversation,openImageModal}) {
  const [reaction, setReaction] = useState(null);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (ele.reactions && ele.reactions.length > 0) {
      setReaction(ele.reactions[0].type || null);
    } else {
      setReaction(null); // Clear reaction if none exists
    }
  }, [ele.reactions]);
  const handleReact = (emoji) => {
    setReaction(emoji);
  };
  return (
    <Stack
      direction={"row"}
      justifyContent={own ? "end" : "start"}
      alignItems={"center"}
      spacing={2}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {own && hovered && (
        <MessageOption
          onReact={handleReact}
          own={own}
          messageId={ele._id}
          receiver={receiver}
          ele={ele}
          refreshConversation={refreshConversation}
          
        />
      )}
      <Box flexDirection={"column"}>
        <Box p={1.5} sx={{ backgroundColor: own ? "skyblue" : "whitesmoke", borderRadius: "20px", width: "max-content" }}>
          <Stack spacing={1}>
          <img
            src={`data:image/jpeg;base64,${ele.image}`}
            alt={ele.text || "Message image"}
            style={{ maxHeight: 210, borderRadius: "10px",cursor:'pointer' }}
            onClick={()=>{openImageModal(`data:image/jpeg;base64,${ele.image}`)}}
            
        />          
         <Typography variant="body2" color={"black"} p={0.5}>{ele.text}</Typography>
            <Typography variant="body2" color={"black"} sx={{ fontSize: "0.7rem", textAlign: "right" }}>
              {formatDate(ele.createdAt)} 
            </Typography>
          </Stack>
        </Box>
        <Box>{reaction && <Typography variant="body2" color={"gray"} align="right">{reaction}</Typography>}</Box>
      </Box>
      {!own && hovered && (
        <MessageOption
          onReact={handleReact}
          own={own}
          messageId={ele._id}
          receiver={receiver}
          ele={ele}
          refreshConversation={refreshConversation}
          
        />
      )}
    </Stack>
  );
}

export function TextMessage({ ele, own, receiver, refreshConversation}) {
  const [reaction, setReaction] = useState(null);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (ele.reactions && ele.reactions.length > 0) {
      setReaction(ele.reactions[0].type || null);
    } else {
      setReaction(null); // Clear reaction if none exists
    }
  }, [ele.reactions]);
  const handleReact = (emoji) => {
    setReaction(emoji);
  };

  return (
    <Stack
      direction={"row"}
      justifyContent={own ? "end" : "start"}
      spacing={2}
      alignItems={"center"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {own && hovered && (
        <MessageOption
          onReact={handleReact}
          own={own}
          messageId={ele._id}
          receiver={receiver}
          ele={ele}
          refreshConversation={refreshConversation}
          
        />
      )}
      <Box flexDirection={"column"}>
        <Box
          padding={1}
          sx={{
            backgroundColor: own ? "skyblue" : "whitesmoke",
            borderRadius: "10px",
            maxWidth: "400px",
            wordBreak: "break-word",
          }}
        >
          <Typography variant="body2" color={"black"}>{ele.text}</Typography>
          <Typography variant="body2" color={"gray"} sx={{ fontSize: "0.6rem", textAlign: "right" }}>
            {formatDate(ele.createdAt)}
          </Typography>
        </Box>
        <Box>{reaction && <Typography variant="body2" color={"gray"} align="right">{reaction}</Typography>}</Box>
      </Box>
      {!own && hovered && (
        <MessageOption
          onReact={handleReact}
          own={own}
          messageId={ele._id}
          receiver={receiver}
          ele={ele}
          refreshConversation={refreshConversation}
          
        />
      )}
    </Stack>
  );
}

export function Timeline({ ele }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Divider sx={{ width: '46%' }} />
      <Typography variant="caption" sx={{ color: "blue" }}>{ele.text}</Typography>
      <Divider sx={{ width: '46%' }} />
    </Stack>
  );
}
