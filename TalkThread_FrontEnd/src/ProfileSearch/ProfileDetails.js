import React, { useState, useEffect } from 'react';
import { Avatar, Box, Typography, Grid, Card, CardMedia, Divider,  } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../Routes/AuthContex';
// import Button from '@mui/material/Button';
const UserProfile = () => {
    const auth = useAuth();
    const [userData, setUserData] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const [posts, setPosts] = useState(null);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/sign/user/${auth?.user?._id}`);
                console.log("User data:", res.data);
                
                // Ensure the data structure is correct
                if (res.data && res.data.image && res.data.name && res.data.username && res.data.bio) {
                    setUserData(res.data);
                } else {
                    console.error('Unexpected user data structure:', res.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (auth?.user?._id) {
            fetchUserData();
        }
    }, [auth?.user?._id]);
    useEffect(()=>{
    const fetchUserPosts = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/post/getPost/${auth?.user?._id}`);
        //   console.log(res.data);
          setPosts(res.data); // Set posts to state
         
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
      };
  
      if (auth?.user?._id) {
        // fetchUserData(); // Fetch user data only if user ID is available
        fetchUserPosts(); // Fetch user posts
      }
    }, [auth?.user?._id])

    const byteArrayToBase64 = (byteArray) => {
        if (!Array.isArray(byteArray)) {
            console.error('Provided data is not an array');
            return null;
        }
      
        const binaryString = byteArray.map(byte => String.fromCharCode(byte)).join('');
        return btoa(binaryString); // Encode to Base64
    };

    const base64String = userData?.image?.data?.data ? byteArrayToBase64(userData.image.data.data) : '';
    const imageUrl = base64String ? `data:image/jpeg;base64,${base64String}` : '';

    const toggleFollow = () => {
        setIsFollowing(prev => !prev);
    };
    

    return (
        <Box sx={{overflowY:'auto'}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100vh' }}> {/* Use 100vh for full viewport height */}
        <Box
            sx={{
                flexGrow: 2,
                display: 'flex',
                justifyContent: 'center',
                overflowY: 'hidden', // Hide overflow on the outer box
                padding: 2,
                bgcolor: 'background.default',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '1200px', // Set a max width for the profile box
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 2,
                    padding: 3,
                    height: 'auto', // Allow height to be determined by content
                    overflowY: 'auto', // Enable vertical scrolling
                }}
            >
                {/* Profile Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                    <Avatar
                        src={imageUrl}
                        alt={userData?.username || "Profile"}
                        sx={{ width: 100, height: 100 }}
                        style={{ display: imageUrl ? 'block' : 'none' }} // Hide until loaded
                    />
                    <Box sx={{ marginLeft: 2 }}>
                        <Typography variant="h5">{userData?.name}</Typography>
                        <Typography variant="subtitle1" color="text.secondary">@{userData?.username}</Typography>
                        <Typography variant="body2" color="text.secondary">{userData?.bio}</Typography>
                    </Box>
                </Box>
                <Divider sx={{ marginBottom: 2 }} />
    
                {/* Follow Button */}
                <button 
                    onClick={toggleFollow} 
                    style={{
                        padding: '10px 50px', 
                        fontSize: '16px',
                        backgroundColor: isFollowing ? '#f44336' : '#3f51b5', // Red if unfollowing, blue if following
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        marginBottom:'5px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = isFollowing ? '#d32f2f' : '#303f9f'; // Darker on hover
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = isFollowing ? '#f44336' : '#3f51b5'; // Original color
                    }}
                >
                    {!isFollowing ? "Follow" : "Unfollow"}
                </button>
    
                {/* Posts Header */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    paddingBottom: 1,
                }}>
                    <Typography variant="h6">Posts</Typography>
                    <Typography variant="body2" color="text.secondary">{posts?.length || 0} Posts</Typography>
                </Box>
    
                <Divider sx={{ marginY: 2 }} />
    
                {/* Posts Grid */}
                <Grid container spacing={2}>
                    {posts?.map((post, index) => (
                        <Grid item xs={12} sm={4} md={3} key={post._id}>
                            <Card 
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                    '&:hover': { boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' },
                                    height: '300px', // Set a fixed height for each card
                                }}>
                                <CardMedia
                                    component="img"
                                    height="200" // Set fixed height for the image
                                    image={`data:${post.post.contentType};base64,${post.post.data}`}
                                    alt={`Post ${index + 1}`}
                                    sx={{ objectFit: 'cover', height: '200px' }} // Ensure the image covers the area
                                />
                                <Box sx={{ padding: 2, height: '100%' }}>
                                    <Typography variant="body1" noWrap>{post.caption}</Typography> {/* Use noWrap for long captions */}
                                    <Typography variant="caption" color="text.secondary">
                                        {`Posted by ${post.name} on ${new Date(post.createdAt).toLocaleDateString()}`}
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    </Box>
    </Box>
    );
};

export default UserProfile;
