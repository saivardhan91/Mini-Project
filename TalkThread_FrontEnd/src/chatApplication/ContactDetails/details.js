import React, { useEffect, useState } from 'react';
import { Stack, Typography, Avatar, IconButton } from '@mui/material';
import axios from 'axios';
import socket from '../../socket';

const Profile = ({ isBlocked, setIsBlocked, receiverDetails, CurrentUser, refreshConversation, conversation, userData }) => {
    const currentUserId = CurrentUser._id;
    const [remove, setRemove] = useState(false); // Tracks if the block button should be removed
    const [isReceiver, setIsReceiver] = useState(false); // Tracks if current user is the receiver

    console.log("User data:", userData);

    const handleBlockUser = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/block/${receiverDetails._id}`, {
                currentUserId,
            });
            console.log(response.data.message); // Log response message
            setIsBlocked(true);
            refreshConversation();
            console.log("Blocked user:", receiverDetails._id);
            socket.emit('blockuser', { receiverId: receiverDetails?._id, CurrentUser: CurrentUser?._id });
        } catch (error) {
            console.error('Error blocking user:', error.response ? error.response.data.message : error.message);
        }
    };

    const handleUnblockUser = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/unblock/${receiverDetails._id}`, {
                currentUserId,
            });
            console.log(response.data.message); // Log response message
            setIsBlocked(false);
            refreshConversation();
            socket.emit('Unblockuser', { receiverId: receiverDetails?._id, CurrentUser: CurrentUser?._id });
        } catch (error) {
            console.error('Error unblocking user:', error.response ? error.response.data.message : error.message);
        }
    };

    useEffect(() => {
        console.log("isBlocked state changed:", isBlocked);
    }, [isBlocked]);

    useEffect(() => {
        // Listen to socket events for blocking and unblocking
        socket.on('blockeUser', ({ CurrentUser }) => {
            setRemove(true);  // Remove the block button
            setIsBlocked(true);  // Set the blocked state
            refreshConversation();
        });

        socket.on('UnblockUser', ({ CurrentUser }) => {
            setIsBlocked(false);
            setRemove(false); // Show the block button
            refreshConversation();
        });

        return () => {
            socket.off('blockeUser');
            socket.off('UnblockUser');
        };
    }, [CurrentUser._id]);

    useEffect(() => {
        // Check if the current user is the receiver of a block
        const checkIfBlocked = async () => {
            const res = await axios.get(`http://localhost:5000/sign/user/${receiverDetails._id}`);
            const isSenderBlocked = res.data.blockedUsers.includes(CurrentUser._id);
            setIsReceiver(isSenderBlocked); // Only the receiver should set this to true
            setRemove(isSenderBlocked); // Hide block button if this user is the receiver
        };
        if (receiverDetails._id) checkIfBlocked();
    }, [receiverDetails._id, CurrentUser._id]);

    return (
        <Stack display={"flex"} flexDirection={'column'} justifyContent={'space-between'} >
            <Stack alignItems="center" spacing={2} padding={7}>
                <Avatar alt="" src={userData?.userProfile?.profile || ''} sx={{ width: 100, height: 100 }} />
                <Stack alignItems={"center"}>
                    <Typography component="div" sx={{ fontWeight: "500", fontSize: "20px" }}>
                        {userData.userProfile.username}
                    </Typography>
                    <Typography variant='body2' color="textSecondary">
                        {userData.userProfile.bio}
                    </Typography>
                </Stack>
            </Stack>
            {/* <Stack display={'flex'} flexDirection={'row'} justifyContent={'space-evenly'}>
                {!remove && (
                    <IconButton
                        sx={{
                            width: '45%',
                            borderRadius: '0px',
                            padding: 0.5,
                            marginRight: 1,
                            textAlign: 'center',
                            border: "2px solid black",
                            '&:hover': {
                                backgroundColor: !isBlocked ? 'red' : 'green',
                                color: 'white'
                            }
                        }}
                        onClick={!isBlocked ? handleBlockUser : handleUnblockUser}
                    >
                        <Typography variant="body2" color={'black'}>
                            {!isBlocked ? "Block" : "Unblock"}
                        </Typography>
                    </IconButton>
                )}
                <IconButton
                    sx={{
                        width: '45%',
                        borderRadius: '0px',
                        padding: 0.5,
                        textAlign: 'center',
                        border: "2px solid black",
                        '&:hover': {
                            backgroundColor: 'skyblue',
                            color: 'white'
                        }
                    }}
                >
                    <Typography variant="body2" color={'black'}>
                        Delete Chat
                    </Typography>
                </IconButton>
            </Stack> */}
        </Stack>
    );
};

export default Profile;
