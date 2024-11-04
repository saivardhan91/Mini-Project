    import React, { useEffect, useState } from 'react';
    import Navbar from './navbar';
    import {
        Card,
        CardContent,
        CardMedia,
        Typography,
        IconButton,
        Divider,
        Avatar,
        Box,
        Modal,
        TextField,
    } from '@mui/material';
    import { Favorite, ChatBubbleOutline,FavoriteBorder } from '@mui/icons-material';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import axios from 'axios';
    import { useAuth } from '../Routes/AuthContex';
    import { PaperPlaneTilt} from '@phosphor-icons/react';
import socket from '../socket';
    const CommentModal = ({ open, handleClose, post, userProfile, comments}) => {
        const auth = useAuth();
        const [newComment, setNewComment] = useState('');
        const [isLiked, setIsLiked] = useState(post.likes.includes(auth?.user?._id));
        const [likeCount, setLikeCount] = useState(post.likes.length || 0);
        const [comment, setComment] = useState([]); // Initialize as an empty array

        useEffect(() => {
            const fetchPost = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/post/getHomePost/${post._id}`);
                    console.log(res);
                    setComment(res.data.comments);
                } catch (error) {
                    console.error("Error fetching post data:", error);
                }
            };
        
            fetchPost();
        }, [post._id]); // Dependency array includes `post._id` to refetch if it changes
        
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/post/getHomePost/${post._id}`);
                console.log(res);
                setComment(res.data.comments);
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };
    
        
        const handleLike = async() => {
            try {
                const res=await axios.put(`http://localhost:5000/post/like/${post._id}`, {
                    userId: auth?.user?._id
                });
                console.log(res.data.likeCount);
                setIsLiked(prevIsLiked => !prevIsLiked);
                setLikeCount(res.data.likeCount);
          

            } catch (error) {
                console.error("Error liking post:", error);
            }
        };
        
        

        const handleAddComment = async () => {
            if (newComment.trim()) {
                try {
                const res= await axios.put(`http://localhost:5000/post/addComment/${post?._id}`, {
                        userId: auth.user._id,
                        text: newComment,
                        name:auth?.user?.name
                    });
                    
                    fetchPost();
                    setNewComment(''); // Clear the comment input after successful addition
                    
                } catch (error) {
                    console.error("Error adding comment:", error);
                }
            }
        };
     
        
        return (
            <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 850,  // Set a fixed width for consistency
                    height: 600, // Set a fixed height for consistency
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    boxSizing: 'border-box',
                }}
            >
                {/* Left Side: Image */}
                <Box sx={{ flex: 1, mr: 2 }}>
                    <img
                        src={`data:image/png;base64,${post.post.data}`}
                        alt="Selected Post"
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '4px',
                            objectFit: 'cover',
                        }}
                    />
                </Box>
        
                {/* Right Side: Comments and Like Section */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '100%',
                        overflowY: 'auto', // Enable scrolling for only the comments section
                        p: 2,
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        {userProfile?.name || 'Unknown User'}
                    </Typography>
                    <Typography variant="body2" color="rgba(0,0,0,0.7)" gutterBottom>
                        {post.caption}
                    </Typography>
        
                    {/* Like Button */}
                
        
                    {/* Comments Section */}
                    <Typography variant="h6" gutterBottom>
                        Comments
                    </Typography>
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto', // Enable scrolling within the comments section itself
                            mb: 2,
                            maxHeight: '300px', // Limit the height to prevent the entire modal from scrolling
                            paddingRight: 1,
                        }}
                    >
                        {comment?.length > 0 ? (
        comment.map((commentItem, index) => (
            <Box key={index} sx={{ mb: 1.5 }}>
                {/* Check if commentItem is defined and has a name */}
                {commentItem && (
                    <>
                        <Typography variant="subtitle2">{commentItem.name}</Typography>
                        <Typography
                            variant="body2"
                            color="black"
                            sx={{
                                maxWidth: '500px',
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                            }}
                        >
                            {commentItem.text}
                        </Typography>
                    </>
                )}
            </Box>
        ))
    ) : (
        <Typography variant="body2" color="gray">
            No comments yet.
        </Typography>
    )}
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton onClick={handleLike} sx={{ color: isLiked ? 'red' : '#48494B' }}>
                            {isLiked ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            {likeCount} likes
                        </Typography>
                        
                    </Box>
                    <Box>
                    <Typography>
                        30/10/24
                    </Typography>
                    </Box>
                    </Box>
                    {/* Add New Comment */}
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    color="primary"
                                    disabled={!newComment.trim()}
                                    onClick={handleAddComment}
                                >
                                    <PaperPlaneTilt style={{ color: newComment.trim() ? 'blue' : 'gray' }} />
                                </IconButton>
                            ),
                        }}
                    />
                </Box>
            </Box>
        </Modal>
        )}    
    const Post = ({ post, userProfile,onCommentClick }) => {
        const imageSrc = `data:image/png;base64,${post.post.data}`;
        const auth=useAuth();
        const [isLiked, setIsLiked] = useState(post.likes.includes(auth?.user?._id));
        const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
    
        const handleLike = async() => {
            try {
                const res=await axios.put(`http://localhost:5000/post/like/${post._id}`, {
                    userId: auth?.user?._id
                });
                console.log(res.data.likeCount);
                setIsLiked(prevIsLiked => !prevIsLiked);
                setLikeCount(res.data.likeCount);
            } catch (error) {
                console.error("Error liking post:", error);
            }
        };

        const byteArrayToBase64 = (byteArray) => {
            if (!Array.isArray(byteArray)) {
                console.error('Provided data is not an array');
                return null;
            }
            const binaryString = byteArray.map(byte => String.fromCharCode(byte)).join('');
            return btoa(binaryString);
        };

        const base64String = userProfile?.image?.data?.data ? byteArrayToBase64(userProfile.image.data.data) : '';
        const imageUrl = base64String ? `data:image/jpeg;base64,${base64String}` : '';

        return (
            <Box sx={{ marginBottom: 0.5 ,border:"3px solid skyblue",borderRadius:2}}>
                <Card variant="outlined" sx={{ boxShadow:5,borderRadius:2}}>
                    <CardMedia component="img" height="500" image={imageSrc} alt={post.caption} />
                    <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.8)' }} />
                    <CardContent sx={{ display: 'flex', alignItems: 'center', color: '#1E1E1E' }}>
                        <Avatar alt="User Image" src={imageUrl || ''} sx={{ width: 52, height: 52, marginRight: 2 }} />
                        <Box>
                            <Typography variant="h6" color="rgba(0,0,0)">
                                {userProfile ? userProfile.name : 'Unknown User'}
                            </Typography>
                            <Typography variant="body2" color="rgba(0,0,0,0.7)">
                                {post.caption}
                            </Typography>
                        </Box>
                    </CardContent>
                    <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.8)' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                        <Box>
                        <IconButton onClick={handleLike} sx={{ color: isLiked ? 'red' : '#48494B' }}>
                            {isLiked ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                            <IconButton sx={{ color: '#48494B' }} onClick={() => onCommentClick(post)}>
                            <ChatBubbleOutline />
                        </IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#1E1E1E' }}>
                            {likeCount} likes
                        </Typography>
                    </Box>
                </Card>
            </Box>
        );
    };

    const Home = () => {
        const [userProfiles, setUserProfiles] = useState([]);
        const [posts, setPosts] = useState([]);
        const auth = useAuth();
        const [selectedPost, setSelectedPost] = useState(null);
        const [isModalOpen, setModalOpen] = useState(false);
        const [comments,setComments]=useState(null);

        useEffect(() => {
            if (auth?.user?._id) {
                console.log('User ID:', auth.user._id); // Debugging log
                socket.emit("addUser", auth.user._id);
        
                // Set up the listener for getUsers if necessary
                // socket.on("getUsers", (users) => {
                //     console.log("Connected users:", users); // For debugging
                // });
            } else {
                console.log('No user found or user ID is undefined'); // Debugging log
            }
        }, [auth?.user?._id]);
        useEffect(() => {
            const fetchFollowing = async () => {
                try {
                    // Fetch current user's details
                    const currentUserRes = await axios.get(`http://localhost:5000/sign/user/${auth?.user?._id}`);
                    const currentUser = currentUserRes.data;

                    // Fetch following user details
                    const { following } = currentUser; // Extract following IDs

                    // Create an array to hold the profiles of current user and their following users
                    const profiles = [currentUser]; // Start with the current user

                    // Fetch details for each following user
                    const followingProfilesPromises = following.map(async (userId) => {
                        const res = await axios.get(`http://localhost:5000/sign/user/${userId}`);
                        return res.data; // Return the user profile
                    });

                    // Wait for all profiles to be fetched
                    const followingProfiles = await Promise.all(followingProfilesPromises);
                    profiles.push(...followingProfiles); // Add following profiles to the array

                    // Set all profiles to state
                    setUserProfiles(profiles);

                    // Fetch posts
                    const userIds = [auth?.user?._id, ...following].join(',');
                    const allPostsRes = await axios.get(`http://localhost:5000/post/getPost`, {
                        params: { userIds }
                    });
                    setPosts(allPostsRes.data);
                } catch (error) {
                    console.error('Error fetching following details:', error);
                }
            };

            if (auth?.user?._id) {
                fetchFollowing();
            }
        }, [auth?.user?._id]);
        const openCommentModal = (post) => {
            setSelectedPost(post);
            setComments(post.comments || []);
            setModalOpen(true);
        };

        const closeModal = () => {
            setModalOpen(false);
            setSelectedPost(null);
        };
        // console.log(selectedPost);
        useEffect(() => {
            console.log('Posts updated:', posts);
            console.log('Selected post updated:', selectedPost);
        }, [posts, selectedPost]);
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
                <Box sx={{ flexGrow: 2, display: 'flex', justifyContent: 'center', overflowY: 'scroll' }} className="bg-secondary">
                    <Box sx={{ height: '100vh', padding: 2, width: '100%', maxWidth: '500px' }}>
                        {posts.map(post => {
                            // Find the corresponding user profile for the post
                            const userProfile = userProfiles.find(profile => profile._id === post.userId);
                            return (
                                <Post key={post._id} post={post} userProfile={userProfile} onCommentClick={openCommentModal} />
                            );
                        })}
                    </Box>
                </Box>
                {selectedPost && (
                    <CommentModal
                    key={`${selectedPost._id}-${selectedPost?.comments?.length}`} // Unique key for re-rendering
                    open={isModalOpen}
                    handleClose={closeModal}
                    post={selectedPost}
                    userProfile={userProfiles.find(profile => profile._id === selectedPost.userId)}
                    comments={comments||[]}
                />
                )}
            </Box>
        );
    };

    export default Home;
