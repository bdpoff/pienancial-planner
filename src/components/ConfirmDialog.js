import React from 'react';
import { Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function ConfirmDialog(props) {

  function handleConfirm() {
    if(typeof props.confirmDialogCallback === 'function') {
      props.confirmDialogCallback();
    }
    if(typeof props.onClose === 'function') {
      props.onClose();
    }
  }

  return (
    <Dialog {...props} open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()}>Cancel</Button>
        <Button variant="contained" onClick={() => handleConfirm()}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
