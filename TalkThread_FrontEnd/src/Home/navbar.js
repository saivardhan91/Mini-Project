import { CodeSimple, Gear } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom'; // Correct import
import { cilHome, cilPlus, cilSearch, cilUser, cilChatBubble } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Divider, Stack, IconButton, Avatar, Menu, MenuItem, Typography, Modal } from '@mui/material';
import {
  CNavItem,
  CSidebar,
  CSidebarNav,
  CNavTitle,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CButton,
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import menuIcon from '../chatApplication/images/menu.png';
import { Settings } from '@mui/icons-material';
const Navbar = () => {
  const navigate = useNavigate(); // Correctly use useNavigate
  const [anchorEl, setAnchorEl] = useState(null);
  // const [openModal, setOpenModal] = useState(false);
  const Logout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate('/signin'); // Use navigate to redirect
  };
  useEffect(() => {
    const token = localStorage.getItem('token'); // Check for token
    if (!token) {
      navigate('/signin'); // Redirect to sign-in if no token is found
    }
  }, [navigate]);
  const settings=()=>{
    handleMenuClose();
    navigate('/settings');
  }
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <CSidebar className="border-end" colorScheme="dark">
      <CSidebarNav>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexDirection: 'column',
            height: '100%', // Ensure the sidebar takes the full height
          }}
        >
          <Box display={'flex'} justifyContent={"flex-start"}>
          <Typography 
          fontSize={'20px'}
          sx={{ fontFamily: 'Pacifico, cursive'}} 
          margin={4}
          className='heading'
        >
          TalkThread 
        </Typography>
        </Box>
          <div
            style={{
              flexGrow: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px', // Make sure items stack vertically
            }}
          >
            <CNavItem href="/home">
              <CIcon customClassName="nav-icon" icon={cilHome} /> Home
            </CNavItem>
            <CNavItem href="/Search">
              <CIcon customClassName="nav-icon" icon={cilSearch} /> Search
            </CNavItem>
            <CNavItem href="/chat">
              <CIcon customClassName="nav-icon" icon={cilChatBubble} /> Chat
            </CNavItem>
            <CNavItem href="/Createpost">
              <CIcon customClassName="nav-icon" icon={cilPlus} /> Create
            </CNavItem>
            <CNavItem href="/Profile">
              <CIcon customClassName="nav-icon" icon={cilUser} /> Profile
            </CNavItem>
          </div>
          {/* <CDropdown>
            <CDropdownToggle href="#" style={{ display: 'flex', flexDirection: 'row' }} color="dark">
              Options
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="#">Settings</CDropdownItem>
              <CDropdownItem>
                <CButton color="secondary" variant="ghost" onClick={Logout}>
                  LogOut
                </CButton>
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown> */}
           <IconButton onClick={handleMenuOpen} display={"flex"} sx={{alignItems:'flex-start',justifyContent:'flex-start'}}>
           <img src={menuIcon} alt="menu" style={{ width: 30, height: 30, objectFit: 'contain' }} />
          </IconButton>

          {/* Menu component */}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {/* Menu item for Settings */}
            <MenuItem onClick={()=>{settings()}}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Gear size={25} />
                <Typography variant="body2" fontSize="15px">
                  Settings
                </Typography>
              </Stack>
            </MenuItem>

            {/* Menu item for Logout */}
            <MenuItem
              onClick={() => {
                handleMenuClose();
                Logout();
              }}
            >
              <Typography variant="body2" fontSize="15px">
                Log out
              </Typography>
            </MenuItem>
          </Menu>
        </div>
      </CSidebarNav>
    </CSidebar>
  );
};

export default Navbar;