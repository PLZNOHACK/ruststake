import { useRef, useState } from 'react';
import {
  Avatar,
  Box,
  ButtonBase,
  Popover,
  Typography
} from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

const AccountPopover = () => {
  const anchorRef = useRef(null);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpen}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex'
        }}
      >
        <Avatar
          src={user.photo}
          sx={{
            height: 32,
            width: 32
          }}
        />
      </Box>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        getContentAnchorEl={null}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 240 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            color="textPrimary"
            variant="subtitle2"
          >
            {user.name}
          </Typography>
          <Typography
            color="textSecondary"
            variant="subtitle2"
          >
            Idk what I should put here :/
          </Typography>
        </Box>
      </Popover>
    </>
  );
};

export default AccountPopover;
