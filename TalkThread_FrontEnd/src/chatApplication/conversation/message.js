import React from 'react';
import { Box, Stack } from '@mui/material';
import { Timeline, MediaMessage, ReplyMessage, TextMessage } from './messageTypes';

export default function ChatData({ message, own,receiver,refreshConversation,openImageModal}) {
    // console.log(message);
    const renderMessage = (message) => {
        if (message.type === "msg") {
            switch (message.subtype) {
                case "image":
                    return <MediaMessage key={message.id} ele={message} own={own} receiver={receiver} refreshConversation={refreshConversation} openImageModal={openImageModal}  />;
                case "reply":
                    return <ReplyMessage key={message.id} ele={message} own={own} receiver={receiver} refreshConversation={refreshConversation}/>;
                default:
                    return <TextMessage key={message.id} ele={message} own={own} receiver={receiver} refreshConversation={refreshConversation}/>;
            }
        }
        return null; // Handle other types or return null if not necessary
    };

    return (
        <Box p={3}>
            <Stack spacing={3}>
                {message && renderMessage(message)}
            </Stack>
        </Box>
    );
}
