import React, { useEffect, useState, useRef } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import close from '../images/close.png';
import Details from './details';
import axios from 'axios'; // Ensure axios is imported

const Contact = React.memo(({ showInfo, setShowInfo, isBlocked,setIsBlocked, receiver,CurrentUser,refreshConversation,conversation }) => {
  const [currentView, setCurrentView] = useState('details');
  const [receiverDetails, setReceiverDetails] = useState(null); // State to store receiver's details
  const contactRef = useRef(null); // Ref to track the contact box
const [userData,setUserData]=useState(null);
  // Fetch receiver details when the receiver changes
  useEffect(() => {
    if (!receiver) return; // Do nothing if receiver is not provided

    const fetchReceiverDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sign/user/${receiver}`);
        setReceiverDetails(response.data); // Update state with receiver's details
        console.log("receiverdata",receiverDetails);
      } catch (error) {
        console.error('Error fetching receiver details:', error);
      }
    };

    fetchReceiverDetails();
  }, [receiver]); // Only re-run this effect when `receiver` changes

  // Close sidebar when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contactRef.current && !contactRef.current.contains(event.target)) {
        setShowInfo(false); // Close the sidebar if the click is outside
      }
    };

    // Add event listener when the component is mounted
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowInfo]);
  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/CreateProfile/profile/${receiverDetails?.email}`);
            // console.log(response);
            setUserData(response.data);
            // console.log("chatlistdataofres", response.data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    if (receiverDetails?.email) {
        fetchUserProfile();
    }
}, [receiverDetails?.email]);
  // If showInfo is false, don't render the Contact sidebar
  if (!showInfo) return null;

  const handleClick = (view) => {
    setCurrentView(view);
  };

  return (
    <Box
      ref={contactRef} // Attach ref to the Contact component's box
      sx={{
        position: 'absolute',
        top: 35,
        left: 480,
        width: '25vw',
        height: '75vh',
        padding: 2,
        backgroundColor: 'white',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        zIndex: 10,
        overflow: 'auto',
      }}
    >
      {/* Close Button */}
      <Box display="flex" justifyContent="flex-end" marginBottom="2px" position={'sticky'}>
        <img
          src={close}
          alt="Close"
          width={22}
          height={22}
          style={{ cursor: 'pointer' }}
          onClick={() => setShowInfo(false)} // Close the sidebar
        />
      </Box>

      {/* Sidebar Navigation and Content */}
      <Stack direction="row" width="100%" height="65vh">
        {/* Sidebar Navigation (Fixed-width) */}
        <Box sx={{ width: '30%', backgroundColor: 'whitesmoke', padding: 2 }}>
          <IconButton
            sx={{
              width: '100%',
              borderRadius: '0px',
              justifyContent: 'flex-start',
              padding: 1,
              textAlign: 'left',
            }}
            onClick={() => handleClick('details')} // Switch to 'details' view
          >
            <Typography variant="body2" color="black">
              Details
            </Typography>
          </IconButton>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ maxWidth:'250px', backgroundColor: '#f0f0f0', padding: 2 }}>
          {/* Render Details component if currentView is 'details' */}
          {currentView === 'details' && (
            <Details isBlocked={isBlocked} setIsBlocked={setIsBlocked} receiverDetails={receiverDetails} CurrentUser={CurrentUser} refreshConversation={refreshConversation} conversation={conversation} userData={userData} />
          )}
        </Box>
      </Stack>
    </Box>
  );
});

export { Contact };
