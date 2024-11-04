import React, { useState, useEffect, useRef } from 'react';
import { Box, Divider, Stack, IconButton, Avatar, Menu, MenuItem, Typography, Modal } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import logo from '../chatApplication/images/logo1.png';
import home from '../chatApplication/images/home.png';
import group from '../chatApplication/images/group.png';
import menuIcon from '../chatApplication/images/menu.png';
import { CodeSimple, Gear } from '@phosphor-icons/react';
import Group from './CreateGroup/Group';
import { useAuth } from '../Routes/AuthContex';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import axios from 'axios';
import defaultImage from '../CreateUser/defaultImage.png';
import luffy from '../Images/1729439948488-avatar.png';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import ChatIcon from '../Images/chatIcon.webp';
import Dictionary from '../Images/9100963.png';
import Dict from '../chatApplication/Dictionary';
const Chat = () => {
  const theme = useTheme();
  const [activeButton, setActiveButton] = useState(null);
  const [userData, setUserData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/CreateProfile/profile/${auth.user.email}`);
        setUserData(response.data);
        console.log("userdata",userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (auth.user.email) {
      fetchUserProfile();
    }
  }, [auth.user.email]);

  // Handle button clicks and menu visibility
  const handleButtonClick = (button, event) => {
    setActiveButton(button);
    if (button === 'menu') {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null); // Close the menu if another button is clicked
    }

    if (button === 'home') {
      // setOpenModal(true); // Open the modal when the group button is clicked
      navigate('/home');
    }
    if (button === 'chat') {
      // setOpenModal(true); // Open the modal when the group button is clicked
      navigate('/chat');
    }
    if (button === 'Profile') {
      // setOpenModal(true); // Open the modal when the group button is clicked
      navigate('/Profile');
    }
    if (button === 'Createpost') {
      // setOpenModal(true); // Open the modal when the group button is clicked
      navigate('/Createpost');
    }
    if (button === 'search') {
      // setOpenModal(true); // Open the modal when the group button is clicked
      navigate('/Search');
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveButton(null);
    setOpenModal(false);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    socket.emit("logout");
    auth.logout();
    navigate("/");
  };
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Box height={'100vh'} sx={{ borderRight: "1px solid black" }}>
      <Box
        p={2}
        component="section"
        sx={{
          height: '100vh',
          display: 'flex',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <Box sx={{ width: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Stack direction="column" alignItems="center" width="100%" spacing={3}>
            <IconButton aria-label="logo" size="large" onClick={()=>{navigate('/home')}}>
              <img src={logo} alt="logo" style={{ width: 30, height: 30, objectFit: 'contain' }} />
            </IconButton>

            <Stack direction="column" alignItems="center" width="max-content">
              <Divider sx={{ width: '100%', my: 1 }} />

              <IconButton
                aria-label="home"
                size="large"
                onClick={(event) => handleButtonClick('home', event)}
                sx={{
                  border: activeButton === 'home' ? '2px solid black' : 'transparent',
                  transition: 'border 0.3s ease',
                }}
              >
                <img src={home} alt="home" style={{ width: 26, height: 26, objectFit: 'contain' }} />
              </IconButton>
              <Divider sx={{ width: '100%', my: 1 }} />
              
              <IconButton
                aria-label="home"
                size="large"
                onClick={(event) => handleButtonClick('search', event)}
                sx={{
                  border: activeButton === 'search' ? '2px solid black' : 'transparent',
                  transition: 'border 0.3s ease',
                }}
              >
               <SearchIcon />
              </IconButton>
              <Divider sx={{ width: '100%', my: 1 }} />
              <IconButton
                aria-label="home"
                size="large"
                onClick={(event) => handleButtonClick('chat', event)}
                sx={{
                  border: activeButton === 'chat' ? '2px solid black' : 'transparent',
                  transition: 'border 0.3s ease',
                }}
              >
                <img src={ChatIcon} alt='img' style={{ width: 26, height: 26, objectFit: 'contain',color:"gray" }} />
              </IconButton>
              <Divider sx={{ width: '100%', my: 1 }} />
              <IconButton
                aria-label="home"
                size="large"
                onClick={(event) => handleButtonClick('Createpost', event)}
                sx={{
                  border: activeButton === 'Createpost' ? '2px solid black' : 'transparent',
                  transition: 'border 0.3s ease',
                }}
              >
                  <AddCircleOutlineIcon  />
              </IconButton>
              <Divider sx={{ width: '100%', my: 1 }} />
              <IconButton
                aria-label="home"
                size="large"
                onClick={(event) => handleButtonClick('Profile', event)}
                sx={{
                  border: activeButton === 'Profile' ? '2px solid black' : 'transparent',
                  transition: 'border 0.3s ease',
                }}
              >
                   <PermIdentityOutlinedIcon />
              </IconButton>
              <Divider sx={{ width: '100%', my: 1 }} />
              <IconButton
                aria-label="home"
                size="large"
                onClick={(event) => handleButtonClick('Dictionary', event)}
                sx={{
                  border: activeButton === 'Dictionary' ? '2px solid black' : 'transparent',
                  transition: 'border 0.3s ease',
                }}
              >
                  <img src={Dictionary} alt='img' style={{width:26,height:26}}onClick={() => setModalOpen(true)} />
              </IconButton>
              

              {/* <IconButton
                aria-label="group"
                size="large"
                onClick={(event) => handleButtonClick('group', event)}
                sx={{
                  border: activeButton === 'group' ? '2px solid black' : 'transparent',
                  transition: 'border 0.3s ease',
                }}
              >
                <img src={group} alt="group" style={{ width: 30, height: 30, objectFit: 'contain' }} />
              </IconButton> */}
            </Stack>
          </Stack>

          <Stack direction="column" alignItems="center" width="100%" my={1}>
            <IconButton
              aria-label="profile"
              size="large"
              onClick={(event) => handleButtonClick('Profile', event)}
              sx={{
                border: activeButton === 'profile' ? '2px solid black' : 'transparent',
                transition: 'border 0.1s ease',
              }}
            >
              <Avatar
                src={userData?.userProfile?.profile 
                    ?  `${userData.userProfile.profile}`
                    : defaultImage} 
                alt={userData?userData.userProfile.username:"Profile"}
                sx={{ cursor: 'pointer' }}
            />

            

            </IconButton>

            {/* Menu Button */}
            <IconButton
              aria-label="menu"
              size="large"
              onClick={(event) => handleButtonClick('menu', event)}
              sx={{
                border: activeButton === 'menu' ? '2px solid black' : 'transparent',
                transition: 'border 0.1s ease',
              }}
            >
              <img src={menuIcon} alt="menu" style={{ width: 30, height: 30, objectFit: 'contain' }} />
            </IconButton>
          </Stack>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={handleClose}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Gear size={25} />
                <Typography variant="body2" fontSize="15px">
                  Settings
                </Typography>
              </Stack>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Stack direction="row" justifyContent="flex-end" width="100%" onClick={handleLogout}>
                <Typography variant="body2" fontSize="15px">
                  Log out
                </Typography>
              </Stack>
            </MenuItem>
          </Menu>
        </Box>

        <Modal
          open={openModal}
          onClose={handleClose}
          aria-labelledby="modal-group"
          aria-describedby="modal-group-description"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <Box>
            <Group open={openModal} handleClose={handleClose} />
          </Box>
        </Modal>
        <Dict open={modalOpen} onClose={() => setModalOpen(false)} />
      </Box>
    </Box>
  );
};

export default Chat;
