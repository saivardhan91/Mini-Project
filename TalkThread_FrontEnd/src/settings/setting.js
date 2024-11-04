import React, { useState } from 'react';
import Navbar from '../Home/navbar';
import {
    CNavItem,
    CSidebar,
    CSidebarNav,
} from '@coreui/react';
import { Box ,Typography} from '@mui/material';
import Editp from './editp';
import Changepass from './chanegpass';

const Settings = () => {
    const [com, setCom] = useState("editp");

    const handleclick = (c) => {
        setCom(c);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '100vh',
                padding: 0,
                margin: 0,
                backgroundColor: '#121212',
                color: '#FFFFFF',
            }}
        >
            <Navbar />
            <Box sx={{ display: 'flex', height: '100vh' }} className="bg-secondary">
                <CSidebar className="border-end" colorScheme="dark">
                    <CSidebarNav>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '8px',
                                flexDirection: 'column',
                                height: '100%',
                            }}
                        >
                            <Box display={'flex'} justifyContent={"flex-start"}>
                                <Typography 
                                    fontSize={'20px'}
                                    sx={{ fontFamily: 'Pacifico, cursive' }} 
                                    margin={4}
                                    className='heading'
                                >
                                    Settings
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <CNavItem href="#editp" onClick={() => handleclick("editp")}>
                                    Edit Profile
                                </CNavItem>
                                <CNavItem href="#changepass" onClick={() => handleclick("pass")}>
                                    Change password
                                </CNavItem>
                            </Box>
                        </Box>
                    </CSidebarNav>
                </CSidebar>
                <Box sx={{
                    height: '100vh',
                    padding: 2,
                    width: '70dvw', // Corrected from '1007dvw' to '100vw'
                    flexGrow: 2,
                    backgroundColor: "white",
                    paddingTop : " 50px",
                    maxWidth: "100%",
                    minWidth: "500px",
                    justifyContent : 'center',
                    alignItems : 'center',
                }}>
                    {com==="editp" && <Editp/>}
                    {com==="pass" && <Changepass/>}
                </Box>
            </Box>
        </Box>
    );
}

export default Settings;


