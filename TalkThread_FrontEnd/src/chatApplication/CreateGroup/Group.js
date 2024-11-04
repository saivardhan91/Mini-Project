import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  Slide,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import * as Yup from 'yup'; // Correct import for Yup
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Autocomplete from '@mui/material/Autocomplete'; // Assuming MUI Autocomplete
import { styled } from '@mui/material/styles';
import Popper from '@mui/material/Popper';

// Styled Popper component for Autocomplete
const StyledPopper = styled(Popper)(({ theme }) => ({
  '& .MuiAutocomplete-paper': {
    maxHeight: '450px',  // Set the maximum height for the dropdown
    overflowY: 'auto',   // Enable vertical scrolling if content exceeds maxHeight
  },
}));

// Transition effect for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Sample members data
const MEMBERS = ["Name 1", "Name 2", "Name 3", "Name 4", "Name 5", "Name 6"];

// CreateGroupForm component
const CreateGroupForm = () => {
  const NewGroupSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    members: Yup.array().min(2, "Must have at least 2 members"),
  });

  const defaultValues = {
    title: "",
    members: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, formState: { errors } } = methods;

  const onSubmit = async (data) => {
    try {
      console.log("Submitted data:", data);
      // Handle successful form submission here
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Stack spacing={2}>
            <Controller
              name="title"
              control={methods.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  error={!!errors.title}
                  helperText={errors.title ? errors.title.message : ''}
                />
              )}
            />
            <Controller
              name="members"
              control={methods.control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  multiple
                  freeSolo
                  options={MEMBERS}
                  onChange={(event, newValue) => setValue('members', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Members"
                      error={!!errors.members}
                      helperText={errors.members ? errors.members.message : ''}
                    />
                  )}
                  PopperComponent={(props) => <StyledPopper {...props} />}
                />
              )}
            />
          </Stack>
          <Stack spacing={2} direction="row" alignItems="center" justifyContent="center">
            <Button type="submit" variant="contained" sx={{ width: '150px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <Typography variant="button" sx={{ width: '100%', textAlign: 'center', marginTop: '18px' }}>
                Create
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
};

// Group component displaying the dialog
export default function Group({ open, handleClose }) {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle>Create New Group</DialogTitle>
      <DialogContent dividers>
        <CreateGroupForm />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
