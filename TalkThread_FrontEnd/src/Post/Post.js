const Post = (post) => {
    return ( 
        <div className="container" style={{
            borderBottom :  '1px solid grey',
            borderTop : '1px solid grey',
            margin : '0px',
            padding : '0px',
        }}> 
            <Card variant="outlined">
                <CardMedia
                    component="img"
                    height="500"
                    width="465"
                    image={post.imageUrl}
                    alt={post.altText}
                />
                <Divider color="black" />
                <CardContent sx={{
                    height : "64px",
                    padding : "4px",
                    display : 'flex',
                }}>
                    <Avatar alt="User Image" src="https://i.pravatar.cc/?img=3" sx={{ width: 52, height: 52, marginLeft : "4px" , marginRight : "8px"}} />

                    <div>
                        <Typography variant="h6" gutterBottom>
                            {post.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {post.caption}
                        </Typography>    
                    </div>
                </CardContent>
                <Divider color="black" />
                <div className="d-flex justify-content-between align-items-center p-2 ">
                        <div>
                            <IconButton>
                                <Favorite />
                            </IconButton>
                            <IconButton>
                                <ChatBubbleOutline />
                            </IconButton>
                        </div>
                        <Typography variant="body2" sx={{ textAlign: 'center' }}>
                            {post.likes} likes
                        </Typography>
                </div>
            </Card>
        </div>
     );
}
 
export default Post;