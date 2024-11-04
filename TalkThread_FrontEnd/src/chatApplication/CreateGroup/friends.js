import React, { useEffect, useState } from "react";
import { Dialog, Tabs, Tab, Stack, DialogContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FetchFriendRequests, FetchUsers, FetchFriends } from "../../Redux/slices/app";


// Main Friends Component
export default function Friends({ open, handleClose }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} keepMounted onClose={handleClose} sx={{ p: 4 }}>
      <Stack p={2} sx={{ width: "100%" }}>
        {/* Use Tabs for managing Tab selections */}
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Explore" />
          <Tab label="Friends" />
          <Tab label="Requests" />
        </Tabs>
      </Stack>
      <DialogContent>
        <Stack sx={{ height: "100%" }}>
          
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
